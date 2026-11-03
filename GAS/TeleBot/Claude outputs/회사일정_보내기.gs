/**
 * 회사일정 → 도연(TeleBot) 일정목록 보내기
 * ─────────────────────────────────────────────
 * 이 스크립트는 "회사일정 추출용 스프레드시트"(IMPORTRANGE 수식이 있는 파일)에 붙여 씁니다.
 * (확장 프로그램 → Apps Script → 이 코드 전체 붙여넣기 → 저장)
 *
 * 하는 일
 *  1) 메뉴 [📤 도연으로 보내기] → 아직 보내지 않은 회사일정만 골라 미리보기
 *  2) [예]를 누르면 도연 시트의 일정목록 탭 맨 아래에 추가 (A·F·H열은 비워 둠)
 *  3) 캘린더 등록은 도연 시트에서 [📅 일정 동기화 → 지금 동기화] 또는 15분 자동 동기화가 담당
 *
 * 중복 방지
 *  - 일정목록에 이미 있는 일정(제목 + 시작 일시가 같음)은 건너뜀
 *  - 한 번 보낸 일정은 이 파일의 숨김 탭 '_보낸기록'에 남김
 *    → 일정목록에서 일부러 지운 일정이 다시 들어가지 않음
 *
 * 안전장치
 *  - IMPORTRANGE가 오류·로딩 중이면 아무것도 보내지 않음
 *  - 대상 탭 이름이 정확히 맞을 때만 씀 (다른 탭으로 잘못 쓰지 않음)
 *  - =, +, -, @ 로 시작하는 값은 수식으로 실행되지 않도록 앞에 ' 를 붙임
 */

// ───────── 설정 ─────────
// 도연 시트(일정목록·할일목록이 있는 파일)의 ID
// 주소 https://docs.google.com/spreadsheets/d/【이 부분】/edit 을 복사해 넣으세요.
const TARGET_SPREADSHEET_ID = '여기에_도연_시트_ID';

// 도연 시트의 일정 탭 이름 (탭 이름을 바꾸지 않았다면 'SHEET  1' — 띄어쓰기 2칸까지 정확히)
const TARGET_SHEET_NAME = '일정목록';

// 이 파일에서 IMPORTRANGE 수식이 있는 탭 이름 (비워 두면 첫 번째 탭)
const SOURCE_SHEET_NAME = '';

// 데이터가 시작하는 행 (수식이 2행에 있으면 2)
const SOURCE_START_ROW = 2;

const LOG_SHEET_NAME = '_보낸기록';
const COLS = 8; // A~H : ID, 제목, 시작, 종료, 메모, 동기화 상태, 장소, 완료여부
const DATE_RE = /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2})?$/;
const END_RE = /^(종일|\d{4}-\d{2}-\d{2}( \d{2}:\d{2})?)$/;
const ERROR_RE = /^#(N\/A|REF!|VALUE!|ERROR!|NAME\?|DIV\/0!|NUM!|NULL!)|^Loading/i;
const TZ = Session.getScriptTimeZone() || 'Asia/Seoul';

// ───────── 메뉴 ─────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📤 도연으로 보내기')
    .addItem('새 회사일정 보내기', 'sendToDoyeon')
    .addSeparator()
    .addItem('보낸 기록 보기', 'showSendLog')
    .addToUi();
}

// ───────── 메인 ─────────
function sendToDoyeon() {
  const ui = SpreadsheetApp.getUi();
  const lock = LockService.getDocumentLock();
  if (!lock.tryLock(10000)) {
    ui.alert('다른 보내기 작업이 진행 중입니다. 잠시 후 다시 시도하세요.');
    return;
  }
  try {
    // 1) 설정 확인
    if (!TARGET_SPREADSHEET_ID || TARGET_SPREADSHEET_ID.indexOf('여기에') === 0) {
      ui.alert('설정 필요', '코드 맨 위 TARGET_SPREADSHEET_ID에 도연 시트의 ID를 넣어주세요.', ui.ButtonSet.OK);
      return;
    }
    let target;
    try {
      target = SpreadsheetApp.openById(TARGET_SPREADSHEET_ID).getSheetByName(TARGET_SHEET_NAME);
    } catch (e) {
      ui.alert('도연 시트를 열 수 없습니다', 'ID가 맞는지, 이 계정에 편집 권한이 있는지 확인하세요.\n\n' + e.message, ui.ButtonSet.OK);
      return;
    }
    if (!target) {
      const names = SpreadsheetApp.openById(TARGET_SPREADSHEET_ID).getSheets().map(s => '「' + s.getName() + '」').join(', ');
      ui.alert('일정 탭을 찾을 수 없습니다',
        `도연 시트에 「${TARGET_SHEET_NAME}」 탭이 없습니다.\n현재 탭: ${names}\n\n코드의 TARGET_SHEET_NAME을 정확한 탭 이름으로 바꿔주세요.`,
        ui.ButtonSet.OK);
      return;
    }

    // 2) 이 파일의 회사일정 읽기
    const read = readSourceRows_();
    if (read.error) {
      ui.alert('보내지 않았습니다', read.error, ui.ButtonSet.OK);
      return;
    }

    // 3) 중복 제외
    const existing = buildExistingKeys_(target);
    const logSheet = getLogSheet_();
    const sentKeys = loadSentKeys_(logSheet);

    const toSend = [], skippedExisting = [], skippedSent = [], invalid = [];
    const batchKeys = {};
    read.rows.forEach(r => {
      const key = makeKey_(r.title, r.start);
      if (!DATE_RE.test(r.start) || (r.end && !END_RE.test(r.end))) { invalid.push(r); return; }
      if (existing[key]) { skippedExisting.push(r); return; }
      if (sentKeys[key]) { skippedSent.push(r); return; }
      if (batchKeys[key]) return;
      batchKeys[key] = true;
      toSend.push(r);
    });

    const summary =
      `일정목록에 이미 있음: ${skippedExisting.length}건\n` +
      `예전에 보낸 일정(일정목록에서 지운 것 포함): ${skippedSent.length}건` +
      (invalid.length ? `\n날짜 형식 오류로 제외: ${invalid.length}건 (${invalid.slice(0, 3).map(r => r.title).join(', ')}${invalid.length > 3 ? ' …' : ''})` : '');

    if (!toSend.length) {
      ui.alert('보낼 새 일정이 없습니다', summary, ui.ButtonSet.OK);
      return;
    }

    // 4) 미리보기 → 확인
    const preview = toSend.slice(0, 20).map(r => `• ${r.start}  ${r.title}`).join('\n')
      + (toSend.length > 20 ? `\n… 외 ${toSend.length - 20}건` : '');
    const answer = ui.alert(`새 일정 ${toSend.length}건을 도연으로 보낼까요?`,
      preview + '\n\n' + summary, ui.ButtonSet.YES_NO);
    if (answer !== ui.Button.YES) return;

    // 5) 일정목록 맨 아래에 추가 (A·F·H 비움 → 도연 동기화 때 새 일정으로 등록)
    const rows = toSend.map(r => ['', safe_(r.title), r.start, r.end, safe_(r.memo), '', safe_(r.loc), '']);
    const startRow = target.getLastRow() + 1;
    target.getRange(startRow, 3, rows.length, 2).setNumberFormat('@'); // 시작·종료는 글자 그대로
    target.getRange(startRow, 1, rows.length, COLS).setValues(rows);

    // 6) 보낸 기록 남기기
    const now = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm');
    const logRows = toSend.map(r => [now, makeKey_(r.title, r.start), r.title, r.start]);
    logSheet.getRange(logSheet.getLastRow() + 1, 1, logRows.length, 4).setNumberFormat('@').setValues(logRows);

    ui.alert('보냈습니다 ✅',
      `${toSend.length}건을 도연 시트 「${TARGET_SHEET_NAME}」에 추가했습니다.\n\n` +
      '캘린더 등록: 도연 시트에서 [📅 일정 동기화 → 지금 동기화]를 누르세요.\n(자동 동기화를 켜 두었다면 15분 안에 등록됩니다.)',
      ui.ButtonSet.OK);
  } finally {
    lock.releaseLock();
  }
}

// ───────── 읽기 ─────────
function readSourceRows_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = SOURCE_SHEET_NAME
    ? ss.getSheetByName(SOURCE_SHEET_NAME)
    : ss.getSheets().filter(s => s.getName() !== LOG_SHEET_NAME)[0];
  if (!sheet) return { error: `이 파일에 「${SOURCE_SHEET_NAME}」 탭이 없습니다. 코드의 SOURCE_SHEET_NAME을 확인하세요.` };

  const lastRow = sheet.getLastRow();
  if (lastRow < SOURCE_START_ROW) return { rows: [] };
  const values = sheet.getRange(SOURCE_START_ROW, 1, lastRow - SOURCE_START_ROW + 1, COLS).getDisplayValues();

  // IMPORTRANGE 오류·로딩 중이면 중단 (빈 결과로 착각해 잘못 보내지 않도록)
  for (let i = 0; i < values.length; i++) {
    for (let c = 0; c < COLS; c++) {
      if (ERROR_RE.test(String(values[i][c]).trim())) {
        return { error: `「${sheet.getName()}」 탭 ${SOURCE_START_ROW + i}행에 오류 또는 로딩 중인 값(${values[i][c]})이 있습니다.\n수식이 정상적으로 표시된 뒤 다시 실행하세요.` };
      }
    }
  }

  const rows = values
    .filter(v => String(v[1]).trim() !== '')
    .map(v => ({
      title: String(v[1]).trim(),
      start: String(v[2]).trim(),
      end: String(v[3]).trim(),
      memo: String(v[4]).trim(),
      loc: String(v[6]).trim()
    }));
  return { rows: rows };
}

// 일정목록에 이미 있는 일정 (제목 + 시작)
function buildExistingKeys_(target) {
  const keys = {};
  const lastRow = target.getLastRow();
  if (lastRow < 2) return keys;
  const vals = target.getRange(2, 2, lastRow - 1, 2).getValues(); // B(제목), C(시작)
  vals.forEach(([title, start]) => {
    if (!title) return;
    keys[makeKey_(title, normStart_(start))] = true;
  });
  return keys;
}

// 시작 일시 표기 통일 (날짜 객체 → yyyy-MM-dd[ HH:mm], 글자 → 공백 정리)
function normStart_(v) {
  if (v instanceof Date) {
    const hm = Utilities.formatDate(v, TZ, 'HH:mm');
    return Utilities.formatDate(v, TZ, 'yyyy-MM-dd') + (hm === '00:00' ? '' : ' ' + hm);
  }
  const s = String(v || '').trim().replace(/\s+/g, ' ').replace(/[./]/g, '-');
  const m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (!m) return s;
  const pad = n => ('0' + n).slice(-2);
  return `${m[1]}-${pad(m[2])}-${pad(m[3])}` + (m[4] ? ` ${pad(m[4])}:${m[5]}` : '');
}

function makeKey_(title, start) {
  const t = String(title || '').replace(/^'/, '').replace(/\s+/g, '').toLowerCase();
  return t + '|' + normStart_(start);
}

// 수식 실행 방지
function safe_(v) {
  const s = String(v == null ? '' : v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// ───────── 보낸 기록 ─────────
function getLogSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(LOG_SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(LOG_SHEET_NAME);
    sh.getRange(1, 1, 1, 4).setValues([['보낸 시각', '중복확인 키', '제목', '시작']]).setFontWeight('bold');
    sh.hideSheet();
  }
  return sh;
}

function loadSentKeys_(sh) {
  const keys = {};
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return keys;
  sh.getRange(2, 2, lastRow - 1, 1).getValues().forEach(([k]) => { if (k) keys[String(k)] = true; });
  return keys;
}

// 숨긴 '_보낸기록' 탭을 열어 보여줌 (특정 일정을 다시 보내려면 그 행을 지우면 됨)
function showSendLog() {
  const sh = getLogSheet_();
  sh.showSheet();
  SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sh);
  SpreadsheetApp.getUi().alert('보낸 기록',
    '한 번 보낸 일정은 다시 보내지 않습니다.\n특정 일정을 다시 보내려면 이 탭에서 그 행을 삭제하세요.\n(확인 후 탭을 다시 숨기려면 탭 이름 우클릭 → 시트 숨기기)',
    SpreadsheetApp.getUi().ButtonSet.OK);
}

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('근태관리대장')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// [중요: 권한 허용 방법]
function authorizeScript() {
  SpreadsheetApp.getActiveSpreadsheet(); 
  console.log("권한이 확인되었습니다.");
}

function processForm(formObject) {
  const SHEET_NAME = '응답데이터';

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error("'" + SHEET_NAME + "' 시트를 찾을 수 없습니다.");
    }

    // 타임스탬프 생성
    const timestamp = new Date();

    // 폼 데이터 매핑
    const type = formObject.type;
    const purpose = formObject.purpose;
    const location = formObject.location || '';
    
    // 날짜 포맷팅 ('YYYY-MM-DD HH:mm' 형태)
    const startDate = formObject.startDate ? new Date(formObject.startDate) : '';
    const endDate = formObject.endDate ? new Date(formObject.endDate) : '';

    // 휴게시간 처리 (숫자 -> "HH:mm" 문자열 변환. 예: 30 -> "00:30", 60 -> "01:00")
    const breakRaw = formObject.includeBreak ? parseInt(formObject.includeBreak) : 0;
    const bH = Math.floor(breakRaw / 60);
    const bM = breakRaw % 60;
    const includeBreak = (bH < 10 ? '0' + bH : bH) + ':' + (bM < 10 ? '0' + bM : bM);

    const applicant = formObject.applicant;

    // [주석 처리됨: 서명 기능]
    // 필요 시 아래 주석을 해제하고, 'check' 자리에 signatureUrl을 넣으세요.
    /*
    let signatureUrl = '';
    if (formObject.signatureData) {
      const data = formObject.signatureData.split(",")[1];
      const decoded = Utilities.base64Decode(data);
      const blob = Utilities.newBlob(decoded, 'image/png', 'signature_' + timestamp.getTime() + '.png');
      
      // 스프레드시트와 같은 폴더에 이미지 저장
      const file = DriveApp.getFileById(ss.getId());
      const folder = file.getParents().next();
      const sigFile = folder.createFile(blob);
      
      // 이미지 보기 URL 생성
      signatureUrl = '=IMAGE("https://drive.google.com/uc?export=view&id=' + sigFile.getId() + '")';
    }
    */

    // 데이터 배열 생성
    // 순서: 타임스탬프, 구분, 출장(연가) 목적, 출장지역(기관명), 시작일(시간), 종료일(시간), 연가시 휴게시간 포함, 신청자, check(서명)
    const rowData = [
      timestamp,       // 타임스탬프
      type,            // 구분
      purpose,         // 출장(연가) 목적
      location,        // 출장지역(기관명)
      startDate,       // 시작일(시간) - Date 객체 그대로 전달 (시트에서 날짜/시간 인식)
      endDate,         // 종료일(시간) - Date 객체 그대로 전달
      includeBreak,    // 연가시 휴게시간 포함 (숫자)
      applicant,       // 신청자
      ''               // check (서명 사용 시 여기에 signatureUrl 변수를 넣으세요)
    ];

    sheet.appendRow(rowData);

    return { success: true, message: "성공적으로 제출되었습니다." };

  } catch (error) {
    return { success: false, message: "오류 발생: " + error.message };
  }
}

// 날짜 포맷팅 헬퍼 함수
function formatDate_(date) {
  if (!date) return '';
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy. M. d a h:mm:ss');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

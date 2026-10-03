/**
 * @OnlyCurrentDoc
 * 이 스크립트가 포함된 스프레드시트에서만 작동하도록 제한합니다.
 * 사용자의 데이터가 다른 문서로 유출되는 것을 방지합니다.
 */

// 시트 이름을 상수로 정의하여 코드 전체에서 일관성을 유지하고 오타를 방지합니다.
const SHEET_NAME = 'FamilyTree';

/**
 * 웹앱에 GET 요청이 들어왔을 때 실행되는 메인 함수입니다.
 * 사용자의 이메일을 가져와 HTML 템플릿에 전달하고, 웹페이지를 렌더링합니다.
 * @param {object} e - 이벤트 객체 (사용하지 않음)
 * @returns {HtmlOutput} - 렌더링된 HTML 페이지 객체
 */
function doGet(e) {
  // 현재 활성화된 사용자의 이메일 주소를 가져옵니다.
  const userEmail = Session.getActiveUser().getEmail();
  
  // 'index.html' 파일을 기반으로 HTML 템플릿을 생성합니다.
  const htmlTemplate = HtmlService.createTemplateFromFile('index');
  
  // 템플릿에 서버 사이드 변수(userEmail)를 전달합니다.
  // HTML 내에서 <?= userEmail ?> 형식으로 사용할 수 있습니다.
  htmlTemplate.userEmail = userEmail;
  
  // 템플릿을 평가(실행)하여 최종 HTML을 생성하고,
  // 웹페이지의 제목과 모바일 뷰포트 설정을 추가하여 반환합니다.
  return htmlTemplate
    .evaluate()
    .setTitle('가계도 그리기 웹앱')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
}

/**
 * 서버 사이드에서 다른 HTML 파일(CSS, JS)을 불러와 메인 HTML에 포함시키는 함수입니다.
 * <?!= include('styles'); ?> 와 같은 형태로 사용됩니다.
 * @param {string} filename - 포함할 파일의 이름 (확장자 제외)
 * @returns {string} - 해당 파일의 내용을 문자열로 반환
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * 특정 사용자의 저장된 모든 가계도 이름 목록을 가져옵니다.
 * @param {string} userEmail - 목록을 조회할 사용자의 이메일
 * @returns {string[]} - 해당 사용자의 가계도 이름 배열 (알파벳순 정렬)
 */
function getFamilyTreeList(userEmail) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    // 시트에 데이터가 없거나 헤더만 있는 경우 빈 배열을 반환합니다.
    if (sheet.getLastRow() <= 1) return [];
    
    const data = sheet.getDataRange().getValues();
    const headers = data.shift(); // 첫 행을 헤더로 분리
    
    // 헤더 이름을 키로, 열 인덱스를 값으로 하는 객체를 생성하여 코드 가독성을 높입니다.
    const colIdx = headers.reduce((acc, header, i) => { acc[header] = i; return acc; }, {});
    
    // 필수 컬럼이 없는 경우 로그를 남기고 빈 배열을 반환합니다.
    if (colIdx.UserID === undefined || colIdx.TreeName === undefined) {
      Logger.log("필수 헤더(UserID, TreeName)가 시트에 없습니다.");
      return [];
    }
    
    const treeNames = new Set(); // 중복된 가계도 이름을 제거하기 위해 Set 사용
    data.forEach(row => {
      // 현재 사용자의 데이터가 맞는지 확인하고, 가계도 이름을 Set에 추가합니다.
      if (row[colIdx.UserID] === userEmail) {
        treeNames.add(row[colIdx.TreeName]);
      }
    });
    
    // Set을 배열로 변환하고 정렬하여 반환합니다.
    return Array.from(treeNames).sort();
  } catch (e) {
    Logger.log('getFamilyTreeList Error: ' + e.message);
    return []; // 오류 발생 시 빈 배열 반환
  }
}

/**
 * 특정 가계도의 상세 데이터를 불러옵니다.
 * @param {string} treeName - 불러올 가계도의 이름
 * @param {string} userEmail - 데이터를 요청한 사용자의 이메일
 * @returns {object[]} - 가계도를 구성하는 인물 데이터 객체의 배열
 */
function getFamilyTreeData(treeName, userEmail) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (sheet.getLastRow() <= 1) return [];
    
    const data = sheet.getDataRange().getValues();
    const headers = data.shift();
    const colIdx = headers.reduce((acc, header, i) => { acc[header] = i; return acc; }, {});
    
    const result = [];
    data.forEach(row => {
      // 현재 사용자의 특정 가계도에 해당하는 데이터 행인지 확인합니다.
      if (row[colIdx.UserID] === userEmail && row[colIdx.TreeName] === treeName) {
        // 행 데이터를 프론트엔드에서 사용하기 쉬운 객체 형태로 변환합니다.
        const person = {
          id: row[colIdx.PersonID],
          name: row[colIdx.Name],
          birthYear: row[colIdx.BirthYear],
          gender: row[colIdx.Gender],
          isDeceased: row[colIdx.IsDeceased] === true, // 명시적으로 boolean 타입으로 변환
          nodeType: row[colIdx.NodeType] || 'person',
          parentId: row[colIdx.ParentID] || null,
          spouseId: row[colIdx.SpouseID] || null,
          relationshipType: row[colIdx.RelationshipType] || null,
          x: parseFloat(row[colIdx.X]), // 문자열일 수 있으므로 숫자로 변환
          y: parseFloat(row[colIdx.Y]),
          multipleBirthGroupId: colIdx.MultipleBirthGroupID !== undefined ? (row[colIdx.MultipleBirthGroupID] || null) : null,
          nextIdenticalSiblingId: colIdx.NextIdenticalSiblingID !== undefined ? (row[colIdx.NextIdenticalSiblingID] || null) : null,
        };
        result.push(person);
      }
    });
    return result;
  } catch (e) {
    Logger.log('getFamilyTreeData Error: ' + e.message);
    return [];
  }
}

/**
 * 현재 가계도 데이터를 스프레드시트에 저장합니다.
 * "덮어쓰기" 방식으로 동작합니다: 기존 데이터를 삭제하고 새 데이터를 추가합니다.
 * @param {string} treeName - 저장할 가계도의 이름
 * @param {object[]} peopleData - 저장할 인물 데이터 객체 배열
 * @param {string} userEmail - 작업을 요청한 사용자의 이메일
 * @returns {string} - 작업 성공 또는 실패 메시지
 */
function saveFamilyTree(treeName, peopleData, userEmail) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const lock = LockService.getScriptLock(); // 동시성 문제를 방지하기 위해 스크립트 잠금
    lock.waitLock(30000); // 최대 30초간 잠금 대기

    const allData = sheet.getDataRange().getValues();
    const headers = allData.length > 0 ? allData[0] : ['UserID', 'TreeName', 'PersonID', 'Name', 'BirthYear', 'Gender', 'IsDeceased', 'NodeType', 'ParentID', 'SpouseID', 'RelationshipType', 'X', 'Y', 'MultipleBirthGroupID', 'NextIdenticalSiblingID'];
    const colIdx = headers.reduce((acc, header, i) => { acc[header] = i; return acc; }, {});

    // 현재 저장하려는 가계도와 관련 없는 데이터만 남깁니다.
    const otherData = allData.length > 1 ? allData.slice(1).filter(row => {
      return !(row[colIdx.UserID] === userEmail && row[colIdx.TreeName] === treeName);
    }) : [];

    // 프론트에서 받은 새 데이터를 시트 형식에 맞게 2차원 배열로 변환합니다.
    const newRows = peopleData.map(p => {
        const row = new Array(headers.length).fill(null);
        row[colIdx.UserID] = userEmail;
        row[colIdx.TreeName] = treeName;
        row[colIdx.PersonID] = p.id;
        row[colIdx.Name] = p.name;
        row[colIdx.BirthYear] = p.birthYear;
        row[colIdx.Gender] = p.gender;
        row[colIdx.IsDeceased] = p.isDeceased;
        row[colIdx.NodeType] = p.nodeType || 'person';
        row[colIdx.ParentID] = p.parentId || null;
        row[colIdx.SpouseID] = p.spouseId || null;
        row[colIdx.RelationshipType] = p.relationshipType || null;
        row[colIdx.X] = p.x;
        row[colIdx.Y] = p.y;
        if (colIdx.MultipleBirthGroupID !== undefined) row[colIdx.MultipleBirthGroupID] = p.multipleBirthGroupId || null;
        if (colIdx.NextIdenticalSiblingID !== undefined) row[colIdx.NextIdenticalSiblingID] = p.nextIdenticalSiblingId || null;
        return row;
    });

    // 시트를 완전히 비우고, 헤더 + 기존 데이터 + 새 데이터를 한 번에 다시 씁니다.
    // 이 방식은 행을 하나씩 삭제하는 것보다 훨씬 빠르고 효율적입니다.
    sheet.clearContents();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    if (otherData.length > 0) {
      sheet.getRange(2, 1, otherData.length, headers.length).setValues(otherData);
    }
    if (newRows.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, headers.length).setValues(newRows);
    }

    lock.releaseLock(); // 작업 완료 후 잠금 해제
    return `"${treeName}" 가계도가 성공적으로 저장되었습니다.`;
  } catch (e) {
    Logger.log('saveFamilyTree Error: ' + e.message);
    return `저장 중 오류가 발생했습니다: ${e.message}`;
  }
}

/**
 * 선택된 가계도들을 시트에서 삭제합니다.
 * @param {string[]} treeNamesToDelete - 삭제할 가계도 이름들의 배열
 * @param {string} userEmail - 작업을 요청한 사용자의 이메일
 * @returns {string} - 작업 성공 또는 실패 메시지
 */
function deleteFamilyTrees(treeNamesToDelete, userEmail) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);

    if (sheet.getLastRow() <= 1) return "삭제할 데이터가 없습니다.";
    
    const allValues = sheet.getDataRange().getValues();
    const headers = allValues.shift();
    const colIdx = headers.reduce((acc, header, i) => { acc[header] = i; return acc; }, {});

    // 삭제 대상이 아닌 행들만 필터링하여 새로운 데이터 배열을 생성합니다.
    const remainingData = allValues.filter(row => 
      !(row[colIdx.UserID] === userEmail && treeNamesToDelete.includes(row[colIdx.TreeName]))
    );

    const numDeleted = allValues.length - remainingData.length;

    if (numDeleted > 0) {
      // 시트를 비우고, 필터링된 데이터만 다시 씁니다.
      sheet.clearContents();
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      if (remainingData.length > 0) {
        sheet.getRange(2, 1, remainingData.length, headers.length).setValues(remainingData);
      }
      lock.releaseLock();
      return `${treeNamesToDelete.length}개의 가계도를 삭제했습니다.`;
    } else {
      lock.releaseLock();
      return "삭제할 가계도를 찾지 못했습니다.";
    }
  } catch (e) {
    Logger.log('deleteFamilyTrees Error: ' + e.message);
    return `삭제 중 오류가 발생했습니다: ${e.message}`;
  }
}
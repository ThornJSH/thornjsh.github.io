import { initMenu } from './menu.js';

async function loadModule(id, file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        const data = await response.text();
        document.getElementById(id).innerHTML = data;
        return data;
    } catch (error) {
        console.error(`Error loading ${file}:`, error);
    }
}

export function updatePageTitle(title) {
    const titleElement = document.getElementById('dynamic-title');
    if (titleElement) {
        titleElement.textContent = title;
    }
}

// 컨텐츠 로드 함수 추가
export async function loadContent(pageName) {
    const pageBody = document.getElementById('page-body');
    if (!pageBody) return;

    // 홈 메뉴 처리
    if (pageName === '홈' || pageName === 'Home') {
        await loadModule('page-body', '/home.html');
    } else if (pageName === '스마트복지기술' || pageName === 'Smart Welfare Tech') {
        await loadModule('page-body', '/smart-welfare-tech.html');
    } else if (pageName === '구글 스프레드시트' || pageName === 'Google Sheets') {
        await loadModule('page-body', '/smartwork-google-sheets.html');
    } else if (pageName === 'DX 스프레드 시트 예제' || pageName === 'DX Spreadsheet Examples' || pageName === '스프레드 시트 예제' || pageName === 'Spreadsheet Examples') {
        await loadModule('page-body', '/sheets-examples.html');
    } else if (pageName === '스마트워크' || pageName === 'Smart Work') {
        await loadModule('page-body', '/smart-work.html');
    } else if (pageName === 'AI 활용 강좌' || pageName === 'AI Courses') {
        await loadModule('page-body', '/ai-courses.html');
    } else if (pageName === '부산 스마트복지 실천기관' || pageName === 'Practice Agencies' || pageName === 'Busan Smart Welfare Agencies') {
        await loadModule('page-body', '/busan-smart-welfare-agencies.html');
    } else if (pageName === '사회복지사를 위한' || pageName === 'For Social Workers') {
        await loadModule('page-body', '/for-social-workers.html');
    } else if (pageName === 'With AI') {
        await loadModule('page-body', '/with-ai.html');
    }
    // 가계도/생태도
    else if (pageName === '가계도 그리기' || pageName === 'Genogram' || pageName.includes('가계도 그리기')) {
        await loadModule('page-body', '/family_tree.html');
    } else if (pageName === '생태도 그리기' || pageName === 'Ecomap' || pageName.includes('생태도 그리기')) {
        await loadModule('page-body', '/ecomap.html');
    }
    // 사회복지사 도구들
    else if (pageName === 'PDF 플립북' || pageName === 'PDF Flipbook') {
        await loadModule('page-body', '/pdf_flipbook.html');
    } else if (pageName === '표 스타일 정리 도구' || pageName === 'Table Styler') {
        await loadModule('page-body', '/table_styler.html');
    } else if (pageName === '후원신청서' || pageName === 'Sponsorship Form') {
        await loadModule('page-body', '/sponsorship_form.html');
    }
    // With AI 세부 항목
    else if (pageName === 'AI Prompt Pro') {
        await loadModule('page-body', '/ai-prompt-pro.html');
    } else if (pageName === 'SNS 홍보문 만들기' || pageName === 'SNS PR Creation') {
        await loadModule('page-body', '/sns-promotion.html');
    } else if (pageName === '문서 타당성 검토' || pageName === 'Document Review') {
        await loadModule('page-body', '/doc-audit.html');
    } else if (pageName === '인권 지향적 글쓰기' || pageName === 'Rights-Oriented Writing') {
        await loadModule('page-body', '/human-rights-docs.html');
    } else if (pageName === 'Docs에서 AI 쓰기' || pageName === 'AI in G.Docs') {
        await loadModule('page-body', '/ai-in-docs.html');
    } else if (pageName === 'Sheet에서 AI 쓰기' || pageName === 'AI in G.SpreadSheets') {
        await loadModule('page-body', '/ai-in-sheets.html');
    } else if (pageName === 'Slide에서 AI 쓰기' || pageName === 'AI in G.Slides') {
        await loadModule('page-body', '/ai-in-slides.html');
    } else if (pageName === '후원 전략 컨설팅' || pageName === 'Sponsorship Consulting') {
        await loadModule('page-body', '/sponsorship-consulting.html');
    } else if (pageName === '챗봇, Chatbot' || pageName === 'AI Chatbot') {
        await loadModule('page-body', '/ai-chatbot.html');
    } else if (pageName === 'Ct 정서 예측 모델' || pageName === 'Ct Emotion Model') {
        await loadModule('page-body', '/emotion-prediction.html');
    }
    // Mini Apps
    else if (pageName === 'Mini App' || pageName === '미니 앱') {
        await loadModule('page-body', '/mini-apps.html');
    } else if (pageName === '윈도우 시계 설정' || pageName === 'Clock setting for Windows11') {
        await loadModule('page-body', '/miniapp-windows-clock.html');
    } else if (pageName === '시간조건 파일 복사' || pageName === 'File Copy based on Time') {
        await loadModule('page-body', '/miniapp-file-copy.html');
    } else if (pageName === '엑셀 비밀번호 일괄변경' || pageName === 'Excel Password Change in bulk') {
        await loadModule('page-body', '/miniapp-excel-password.html');
    } else if (pageName === 'PDF MultiTool' || pageName === 'PDF MultiTool(Split/Merge/Protect)') {
        await loadModule('page-body', '/miniapp-pdf-tool.html');
    }
    // 통계다루기
    else if (pageName === '통계다루기' || pageName === 'Statistics' || pageName === '통계다루기' || pageName === 'Statistics Overview') {
        await loadModule('page-body', '/stats-overview.html');
    } else if (pageName === '기초 통계 분석' || pageName === 'Basic Analysis') {
        await loadModule('page-body', '/stats-basic.html');
    } else if (pageName === '사전-사후 비교' || pageName === 'Pre-Post comparison' || pageName.includes('사전-사후 비교')) {
        await loadModule('page-body', '/stats-pre-post.html');
    } else if (pageName === 'IPA 분석(Excel)' || pageName === 'IPA Analysis') {
        await loadModule('page-body', '/stats-ipa.html');
    }
    // 이런 것도 가능해요
    else if (pageName === '이런 것도 가능해요' || pageName === 'Extras' || pageName.includes('가능해요')) {
        await loadModule('page-body', '/possibilities.html');
    }
    else if (pageName === '[게임] 아기하마 구하기' || pageName === '[Game] Save Hippo' || pageName.includes('아기하마 구하기')) {
        await loadModule('page-body', '/game-save-hippo.html');
    } else if (pageName === '크리에이티브 쇼케이스' || pageName === 'Creative Showcase') {
        await loadModule('page-body', '/possibilities-showcase.html');
    }
    // FAQ
    else if (pageName === 'FAQ') {
        await loadModule('page-body', '/faq.html');
    }
    else if (pageName === '초기설정(권한 설정)' || pageName === 'Initial Setting') {
        await loadModule('page-body', '/faq-permission.html');
    } else if (pageName === '사본 만들기' || pageName === 'Make a Copy') {
        await loadModule('page-body', '/faq-make-copy.html');
    } else if (pageName === 'API 키 만들기' || pageName === 'Create API Key') {
        await loadModule('page-body', '/faq-api-key.html');
    }
    else {
        // 다른 메뉴의 경우 임시 자리표시자
        pageBody.innerHTML = `
      <section class="content-placeholder">
        <h2>${pageName}</h2>
        <p>죄송합니다. '${pageName}'에 대한 콘텐츠를 준비 중입니다.</p>
      </section>
    `;
    }
}

async function init() {
    const header = document.getElementById('header');
    if (header && !header.innerHTML.trim()) {
        await loadModule('header', '/header.html');
    }

    const footer = document.getElementById('footer');
    if (footer && !footer.innerHTML.trim()) {
        await loadModule('footer', '/footer.html');
    }

    initMenu();

    // URL 파라미터 처리 (?page=...)
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');

    if (pageParam) {
        // 파라미터가 있으면 해당 페이지 로드
        loadContent(pageParam);
        updatePageTitle(pageParam);
    } else {
        // 파라미터가 없으면 기본값(홈) 로드 로직
        const pageBody = document.getElementById('page-body');
        const hasStaticHome = pageBody && pageBody.querySelector('.home-container');

        if (!hasStaticHome) {
            loadContent('홈');
        }
    }
}

document.addEventListener('DOMContentLoaded', init);
window.updatePageTitle = updatePageTitle;
window.loadContent = loadContent; // 전역 접근 허용

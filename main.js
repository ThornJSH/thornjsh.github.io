import { initMenu } from './menu.js';

async function loadModule(id, file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        const data = await response.text();
        const element = document.getElementById(id);
        if (!element) return;

        element.innerHTML = data;

        // 동적으로 삽입된 스크립트 실행 처리
        const scripts = element.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            // 원래 스크립트의 모든 속성 복사 (src 등)
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            // 인라인 스크립트 내용 복사
            if (oldScript.innerHTML) {
                newScript.textContent = oldScript.innerHTML;
            }
            // 기존 스크립트를 새 스크립트로 교체하여 실행 유도
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });

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
    // 브라우저 탭 제목도 업데이트 (AdSense 크롤러 및 SEO)
    const fullTitle = `${title} : Smart Welfare Tech`;
    document.title = fullTitle;

    // OG Title 및 Meta Description 동적 업데이트
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', fullTitle);

    // 페이지 이름에 따라 설명문 최적화 (간단 예시)
    const description = document.querySelector('meta[name="description"]');
    if (description) {
        let content = `Smart Welfare Tech - ${title}: 사회복지 현장을 위한 AI 및 디지털 전환 가이드`;
        description.setAttribute('content', content);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', content);
    }

    // Canonical 태그 업데이트
    let canonical = document.getElementById('canonical-link');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.id = 'canonical-link';
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }

    // 현재 URL 구성을 유지하되 파라미터를 정확히 반영
    const currentUrl = new URL(window.location.href);
    if (title === '홈' || title === 'Home') {
        canonical.setAttribute('href', 'https://thornjsh.github.io/');
    } else {
        // 공백 처리 등을 고려하여 정확한 파라미터 URL 생성
        const canonicalUrl = `https://thornjsh.github.io/?page=${encodeURIComponent(title)}`;
        canonical.setAttribute('href', canonicalUrl);
    }
}

// 페이지 이동 통합 함수
export function navigateToPage(pageName) {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('page', pageName);
    window.history.pushState({ page: pageName }, '', currentUrl);
    updatePageTitle(pageName);
    loadContent(pageName);
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
    } else if (pageName === 'DX Docs 매뉴얼' || pageName === 'DX Docs Manuals') {
        await loadModule('page-body', '/docs-manuals.html');
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
        await loadModule('page-body', '/miniapp-pdf-flipbook.html');
    } else if (pageName === '표 스타일 정리 도구' || pageName === 'Table Styler') {
        await loadModule('page-body', '/table_styler.html');
    } else if (pageName === 'GPS를 활용한 출퇴근관리' || pageName === 'GPS Attendance Management') {
        await loadModule('page-body', '/gps-attendance.html');
    } else if (pageName === '근태관리대장' || pageName === 'Attendance Management') {
        await loadModule('page-body', '/attendance-app.html');
    } else if (pageName === '후원신청서' || pageName === 'Sponsorship Form') {
        await loadModule('page-body', '/sponsorship_form.html');
    }
    else if (pageName === '사회복지시설 공통업무 캘린더' || pageName === 'Common Work Calendar') {
        await loadModule('page-body', '/social-worker-calendar.html');
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
    } else if (pageName === 'Gemini로 PPT 만들기' || pageName === 'Creating PPT with Gemini') {
        await loadModule('page-body', '/gemini-ppt.html');
    } else if (pageName === '후원 전략 컨설팅' || pageName === 'Sponsorship Consulting') {
        await loadModule('page-body', '/sponsorship-consulting.html');
    } else if (pageName === '챗봇, Chatbot' || pageName === 'AI Chatbot') {
        await loadModule('page-body', '/ai-chatbot.html');
    } else if (pageName === 'Ct 정서 예측 모델' || pageName === 'Ct Emotion Model') {
        await loadModule('page-body', '/emotion-prediction.html');
    }
    // Mini Apps
    else if (pageName === 'Mini Apps' || pageName === '미니 앱' || pageName === 'Mini App') {
        await loadModule('page-body', '/mini-apps.html');
    } else if (pageName === '윈도우 시계 설정' || pageName === 'Clock setting for Windows11') {
        await loadModule('page-body', '/miniapp-windows-clock.html');
    } else if (pageName === '시간조건 파일 복사' || pageName === 'File Copy based on Time') {
        await loadModule('page-body', '/miniapp-file-copy.html');
    } else if (pageName === '엑셀 비밀번호 일괄변경' || pageName === 'Excel Password Change in bulk') {
        await loadModule('page-body', '/miniapp-excel-password.html');
    } else if (pageName === 'PDF MultiTool' || pageName === 'PDF MultiTool(Split/Merge/Protect)') {
        await loadModule('page-body', '/miniapp-pdf-tool.html');
    } else if (pageName === 'PDF Binder(Web)' || pageName === 'PDF Binder (Web)') {
        await loadModule('page-body', '/miniapp-pdf-binder-web.html');
    } else if (pageName === 'Table Styler Web') {
        await loadModule('page-body', '/miniapp-table-cleaner-web.html');
    } else if (pageName === '법령 조문(키워드) 검색' || pageName === 'Legal Provision Search') {
        await loadModule('page-body', '/miniapp-wlaw-search.html');
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
    // Vibe Coding
    else if (pageName === '바이브 코딩(철학)' || pageName === 'Vibe Coding: Philosophy') {
        await loadModule('page-body', '/vibe-coding-philosophy.html');
    }
    else if (pageName === '바이브 코딩(활용팁)' || pageName === '바이브 코딩(꿀팁)' || pageName === 'Vibe Coding: Tips') {
        await loadModule('page-body', '/vibe-coding-tips.html');
    }
    else if (pageName === '열매똑똑 아이디어 HUB' || pageName === 'Idea HUB') {
        await loadModule('page-body', '/idea-hub.html');
        // 페이지 로딩 시 새 창으로 자동 이동 (브라우저 팝업 차단에 주의)
        window.open('https://script.google.com/macros/s/AKfycbyPLnlrTM2-0tNy-O9fQj5eoVNC9oytxkCDBzIy094CJyYJsdJ5S9XFsbqnT194tovJ/exec', '_blank');
    }
    else if (pageName === '초기설정(권한 설정)' || pageName === 'Initial Setting') {
        await loadModule('page-body', '/faq-permission.html');
    } else if (pageName === '사본 만들기' || pageName === 'Make a Copy') {
        await loadModule('page-body', '/faq-make-copy.html');
    } else if (pageName === 'API 키 만들기' || pageName === 'Create API Key') {
        await loadModule('page-body', '/faq-api-key.html');
    } else if (pageName === '구글 클라우드 설정' || pageName === 'Google Cloud Setup') {
        await loadModule('page-body', '/google-api-setup.html');
    } else if (pageName === 'Q&A (질문과 답변)' || pageName === 'Q&A') {
        await loadModule('page-body', '/qna.html');
    }
    else if (pageName === '사이트맵' || pageName === 'Sitemap') {
        await loadModule('page-body', '/sitemap.html');
    }
    else if (pageName === '개인정보처리방침' || pageName === 'Privacy Policy') {
        await loadModule('page-body', '/privacy.html');
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

    // [애드센스 최적화] 페이지 로드 후 광고 갱신
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        // 첫 로드 시점에 라이브러리가 아직 안 왔을 수 있음
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

    // 뒤로가기/앞으로가기 버튼 대응
    window.addEventListener('popstate', (event) => {
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = urlParams.get('page') || urlParams.get('p')?.substring(1) || '홈';
        loadContent(pageParam);
        updatePageTitle(pageParam);
    });

    // URL 파라미터 처리 (?page=... 또는 ?p=...)
    const urlParams = new URLSearchParams(window.location.search);
    let pageParam = urlParams.get('page');
    const pathParam = urlParams.get('p');

    // 만약 404 리다이렉트로 들어온 경우 (?p=/page-name)
    if (pathParam) {
        pageParam = pathParam.substring(1); // 맨 앞의 '/' 제거
        // 주소를 깔끔하게 정리 (브라우저 주소창에서 ?p=... 제거)
        window.history.replaceState(null, '', pathParam);
    }

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
window.navigateToPage = navigateToPage; // 전역 접근 허용

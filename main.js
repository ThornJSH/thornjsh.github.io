import { initMenu } from './menu.js';

// MPA 매핑 테이블 (한글 페이지명 -> 실제 .html 경로)
const pageMap = {
    '홈': '/',
    'Home': '/',
    '스마트복지기술': '/smart-welfare-tech.html',
    'Smart Welfare Tech': '/smart-welfare-tech.html',
    '구글 스프레드시트': '/smartwork-google-sheets.html',
    'Google Sheets': '/smartwork-google-sheets.html',
    'DX 스프레드 시트 예제': '/sheets-examples.html',
    'DX Spreadsheet Examples': '/sheets-examples.html',
    '스프레드 시트 예제': '/sheets-examples.html',
    'Spreadsheet Examples': '/sheets-examples.html',
    '스마트워크': '/smart-work.html',
    'Smart Work': '/smart-work.html',
    'DX Docs 매뉴얼': '/docs-manuals.html',
    'DX Docs Manuals': '/docs-manuals.html',
    'AI 활용 강좌': '/ai-courses.html',
    'AI Courses': '/ai-courses.html',
    '부산 스마트복지 실천기관': '/busan-smart-welfare-agencies.html',
    'Practice Agencies': '/busan-smart-welfare-agencies.html',
    'Busan Smart Welfare Agencies': '/busan-smart-welfare-agencies.html',
    '사회복지사를 위한': '/for-social-workers.html',
    '사회복지사를 위한 도구': '/for-social-workers.html',
    'For Social Workers': '/for-social-workers.html',
    'With AI': '/with-ai.html',
    'Care Insight': '/care-insight.html',
    '케어 인사이트': '/care-insight.html',
    'Care Insight (사례관리)': '/care-insight.html',
    'Care Insight (AI Case Manager)': '/care-insight.html',
    '한국어 문장 감성 분석기': '/senti-analysis.html',
    'Korean Sentiment Analyzer': '/senti-analysis.html',
    '가계도 그리기': '/family_tree.html',
    'Genogram': '/family_tree.html',
    '생태도 그리기': '/ecomap.html',
    'Ecomap': '/ecomap.html',
    'PDF 플립북': '/miniapp-pdf-flipbook.html',
    'PDF Flipbook': '/miniapp-pdf-flipbook.html',
    '표 스타일 정리 도구': '/table_styler.html',
    'Table Styler': '/table_styler.html',
    'GPS를 활용한 출퇴근관리': '/gps-attendance.html',
    'GPS 출퇴근관리': '/gps-attendance.html',
    'GPS Attendance Management': '/gps-attendance.html',
    '근태관리대장': '/attendance-app.html',
    'Attendance Management': '/attendance-app.html',
    '후원신청서': '/sponsorship_form.html',
    'Sponsorship Form': '/sponsorship_form.html',
    '사회복지시설 공통업무 캘린더': '/social-worker-calendar.html',
    'Common Work Calendar': '/social-worker-calendar.html',
    '민간복지 포털 구성(안)': '/private-welfare-portal.html',
    'Private Welfare Portal': '/private-welfare-portal.html',
    'AI Prompt Pro': '/ai-prompt-pro.html',
    'SNS 홍보문 만들기': '/sns-promotion.html',
    'SNS PR Creation': '/sns-promotion.html',
    '문서 타당성 검토': '/doc-audit.html',
    'Document Review': '/doc-audit.html',
    '인권 지향적 글쓰기': '/human-rights-docs.html',
    'Rights-Oriented Writing': '/human-rights-docs.html',
    'Docs에서 AI 쓰기': '/ai-in-docs.html',
    'AI in G.Docs': '/ai-in-docs.html',
    'Sheet에서 AI 쓰기': '/ai-in-sheets.html',
    'AI in G.SpreadSheets': '/ai-in-sheets.html',
    'Slide에서 AI 쓰기': '/ai-in-slides.html',
    'AI in G.Slides': '/ai-in-slides.html',
    'Gemini로 PPT 만들기': '/gemini-ppt.html',
    'Creating PPT with Gemini': '/gemini-ppt.html',
    '유용한 프롬프트': '/useful-prompts.html',
    'Useful Prompts': '/useful-prompts.html',
    '후원 전략 컨설팅': '/sponsorship-consulting.html',
    'Sponsorship Consulting': '/sponsorship-consulting.html',
    '챗봇, Chatbot': '/ai-chatbot.html',
    '챗봇 (Chatbot)': '/ai-chatbot.html',
    'AI Chatbot': '/ai-chatbot.html',
    'Ct 정서 예측 모델': '/emotion-prediction.html',
    'Ct Emotion Model': '/emotion-prediction.html',
    'Mini Apps': '/mini-apps.html',
    '미니 앱': '/mini-apps.html',
    'Mini App': '/mini-apps.html',
    '윈도우 시계 설정': '/miniapp-windows-clock.html',
    'Clock setting for Windows11': '/miniapp-windows-clock.html',
    '시간조건 파일 복사': '/miniapp-file-copy.html',
    'File Copy based on Time': '/miniapp-file-copy.html',
    '엑셀 비밀번호 일괄변경': '/miniapp-excel-password.html',
    'Excel Password Change in bulk': '/miniapp-excel-password.html',
    'PDF MultiTool': '/miniapp-pdf-tool.html',
    'PDF MultiTool(Split/Merge/Protect)': '/miniapp-pdf-tool.html',
    'PDF Binder(Web)': '/miniapp-pdf-binder-web.html',
    'PDF Binder (Web)': '/miniapp-pdf-binder-web.html',
    'Table Styler Web': '/miniapp-table-cleaner-web.html',
    '법령 조문(키워드) 검색': '/miniapp-wlaw-search.html',
    '법령 조문 검색': '/miniapp-wlaw-search.html',
    'Legal Provision Search': '/miniapp-wlaw-search.html',
    'HOP: 가벼운 HWP 문서 뷰어': '/miniapp-rhwp.html',
    'HOP - HWP 문서 뷰어': '/miniapp-rhwp.html',
    'HOP': '/miniapp-rhwp.html',
    '온라인 마인드맵': '/miniapp-mindmap-web.html',
    'Online Mindmap': '/miniapp-mindmap-web.html',
    '함께보기': '/explore-overview.html',
    'Explore Together': '/explore-overview.html',
    'Explore Together Overview': '/explore-overview.html',
    '통계다루기': '/stats-overview.html',
    'Statistics': '/stats-overview.html',
    'Statistics Overview': '/stats-overview.html',
    '기초 통계 분석': '/stats-basic.html',
    'Basic Analysis': '/stats-basic.html',
    '사전-사후 비교': '/stats-pre-post.html',
    '사전-사후 비교 분석': '/stats-pre-post.html',
    'Pre-Post comparison': '/stats-pre-post.html',
    'IPA 분석(Excel)': '/stats-ipa.html',
    'IPA 분석 (Excel)': '/stats-ipa.html',
    'IPA Analysis': '/stats-ipa.html',
    '분석방법론 탐색기': '/stats-methodology.html',
    'Methodology Explorer': '/stats-methodology.html',
    'AI 통계 분석 에이전트': '/stats-agent.html',
    'AI 통계 분석 에이전트 (Stat-Insight)': '/stats-agent.html',
    'AI Stat Agent': '/stats-agent.html',
    'Stat-Insight': '/stats-agent.html',
    'StatAgent': '/stats-agent.html',
    '이런 것도 가능해요': '/possibilities.html',
    'Extras': '/possibilities.html',
    '[게임] 아기하마 구하기': '/game-save-hippo.html',
    '아기하마 구하기 게임': '/game-save-hippo.html',
    '[Game] Save Hippo': '/game-save-hippo.html',
    '크리에이티브 쇼케이스': '/possibilities-showcase.html',
    'Creative Showcase': '/possibilities-showcase.html',
    'FAQ': '/faq.html',
    'FAQ - 자주 묻는 질문': '/faq.html',
    '바이브 코딩(철학)': '/vibe-coding-philosophy.html',
    '바이브 코딩 - 철학': '/vibe-coding-philosophy.html',
    'Vibe Coding: Philosophy': '/vibe-coding-philosophy.html',
    '바이브 코딩(활용팁)': '/vibe-coding-tips.html',
    '바이브 코딩 - 활용팁': '/vibe-coding-tips.html',
    '바이브 코딩(꿀팁)': '/vibe-coding-tips.html',
    'Vibe Coding: Tips': '/vibe-coding-tips.html',
    '열매똑똑 아이디어 HUB': '/idea-hub.html',
    'Idea HUB': '/idea-hub.html',
    '초기설정(권한 설정)': '/faq-permission.html',
    '초기설정 - 권한 설정': '/faq-permission.html',
    'Initial Setting': '/faq-permission.html',
    '사본 만들기': '/faq-make-copy.html',
    '사본 만들기 가이드': '/faq-make-copy.html',
    'Make a Copy': '/faq-make-copy.html',
    'API 키 만들기': '/faq-api-key.html',
    'Create API Key': '/faq-api-key.html',
    '구글 클라우드 설정': '/google-api-setup.html',
    'Google Cloud Setup': '/google-api-setup.html',
    'Q&A (질문과 답변)': '/qna.html',
    'Q&A - 질문과 답변': '/qna.html',
    'Q&A': '/qna.html',
    '사이트맵': '/sitemap.html',
    'Sitemap': '/sitemap.html',
    '개인정보처리방침': '/privacy.html',
    'Privacy Policy': '/privacy.html'
};

async function loadModule(id, file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        const data = await response.text();
        const element = document.getElementById(id);
        if (!element) return;

        element.innerHTML = data;

        const scripts = element.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            if (oldScript.innerHTML) {
                newScript.textContent = oldScript.innerHTML;
            }
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });

        return data;
    } catch (error) {
        console.error(`Error loading ${file}:`, error);
    }
}

export function updatePageTitle(title) {
    // MPA에서는 각 HTML 파일에 title이 이미 설정되어 있으므로 동적 변경 최소화
}

export async function navigateToPage(pageName) {
    await loadContent(pageName);
}

export async function loadContent(pageName) {
    // 열매똑똑 아이디어 HUB 예외 처리 (새 창 열기)
    if (pageName === '열매똑똑 아이디어 HUB' || pageName === 'Idea HUB') {
        window.open('https://script.google.com/macros/s/AKfycbyPLnlrTM2-0tNy-O9fQj5eoVNC9oytxkCDBzIy094CJyYJsdJ5S9XFsbqnT194tovJ/exec', '_blank');
        return;
    }

    const targetUrl = pageMap[pageName] || '/';
    try {
        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error(`Failed to fetch ${targetUrl}`);
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        const newBody = doc.getElementById('page-body');
        const currentBody = document.getElementById('page-body');

        if (newBody && currentBody) {
            currentBody.innerHTML = newBody.innerHTML;

            // 스크립트 재실행 처리
            const scripts = currentBody.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                if (oldScript.innerHTML) {
                    newScript.textContent = oldScript.innerHTML;
                }
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });

            // 타이틀 및 URL 업데이트 (PJAX)
            document.title = doc.title;
            const dynamicTitle = document.getElementById('dynamic-title');
            const newDynamicTitle = doc.getElementById('dynamic-title');
            if (dynamicTitle && newDynamicTitle) {
                dynamicTitle.textContent = newDynamicTitle.textContent;
            }

            window.history.pushState({ page: pageName }, doc.title, targetUrl);

            // 애드센스 갱신
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {}

            // 스크롤 상단 이동
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // 폴백: DOM 구조가 다를 경우 일반 이동
            window.location.href = targetUrl;
        }
    } catch (error) {
        console.error(`PJAX error for ${targetUrl}:`, error);
        window.location.href = targetUrl;
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

    // 기존 북마크나 외부 링크를 통해 파라미터 URL(?page=... 또는 ?p=...)로 접속한 경우 MPA 경로로 리다이렉트
    const urlParams = new URLSearchParams(window.location.search);
    let pageParam = urlParams.get('page');
    const pathParam = urlParams.get('p');

    if (pathParam) {
        pageParam = decodeURIComponent(pathParam.substring(1));
    }

    if (pageParam) {
        const targetUrl = pageMap[pageParam];
        if (targetUrl) {
            window.location.replace(targetUrl);
        } else {
            window.location.replace('/');
        }
    }

    // [애드센스 최적화] 페이지 로드 후 광고 갱신
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        // 첫 로드 시점에 라이브러리가 아직 안 왔을 수 있음
    }
}

document.addEventListener('DOMContentLoaded', init);
window.updatePageTitle = updatePageTitle;
window.loadContent = loadContent; // 전역 접근 허용
window.navigateToPage = navigateToPage; // 전역 접근 허용

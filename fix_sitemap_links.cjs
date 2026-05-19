const fs = require('fs');
const path = 'e:/github_page/sitemap.html';

let content = fs.readFileSync(path, 'utf8');

const mapping = {
    '홈': 'home.html',
    '스마트워크': 'smart-work.html',
    '바이브 코딩(철학)': 'vibe-coding-philosophy.html',
    '바이브 코딩(활용팁)': 'vibe-coding-tips.html',
    '구글 스프레드시트': 'smartwork-google-sheets.html',
    'DX 스프레드 시트 예제': 'sheets-examples.html',
    'DX Docs 매뉴얼': 'docs-manuals.html',
    'AI 활용 강좌': 'ai-courses.html',
    '부산 스마트복지 실천기관': 'busan-smart-welfare-agencies.html',
    '열매똑똑 아이디어 HUB': 'idea-hub.html',
    '가계도 그리기': 'family_tree.html',
    '생태도 그리기': 'ecomap.html',
    'GPS를 활용한 출퇴근관리': 'gps-attendance.html',
    '표 스타일 정리 도구': 'table_styler.html',
    '후원신청서': 'sponsorship_form.html',
    '사회복지시설 공통업무 캘린더': 'social-worker-calendar.html',
    'AI Prompt Pro': 'ai-prompt-pro.html',
    'SNS 홍보문 만들기': 'sns-promotion.html',
    '문서 타당성 검토': 'doc-audit.html',
    '인권 지향적 글쓰기': 'human-rights-docs.html',
    'Docs에서 AI 쓰기': 'ai-in-docs.html',
    'Sheet에서 AI 쓰기': 'ai-in-sheets.html',
    'Slide에서 AI 쓰기': 'ai-in-slides.html',
    'Gemini로 PPT 만들기': 'gemini-ppt.html',
    '후원 전략 컨설팅': 'sponsorship-consulting.html',
    '챗봇, Chatbot': 'ai-chatbot.html',
    'Ct 정서 예측 모델': 'emotion-prediction.html',
    '윈도우 시계 설정': 'miniapp-windows-clock.html',
    '시간조건 파일 복사': 'miniapp-file-copy.html',
    '엑셀 비밀번호 일괄변경': 'miniapp-excel-password.html',
    'PDF MultiTool': 'miniapp-pdf-tool.html',
    '법령 조문(키워드) 검색': 'miniapp-wlaw-search.html',
    'PDF Binder(Web)': 'miniapp-pdf-binder-web.html',
    'PDF 플립북': 'miniapp-pdf-flipbook.html',
    'HOP: 가벼운 HWP 문서 뷰어': 'miniapp-rhwp.html',
    '기초 통계 분석': 'stats-basic.html',
    '사전-사후 비교': 'stats-pre-post.html',
    'IPA 분석(Excel)': 'stats-ipa.html',
    'AI 통계 분석 에이전트': 'stats-agent.html',
    '초기설정(권한 설정)': 'faq-permission.html',
    '사본 만들기': 'faq-make-copy.html',
    'API 키 만들기': 'faq-api-key.html',
    '구글 클라우드 설정': 'google-api-setup.html',
    'Q&A (질문과 답변)': 'qna.html'
};

for (const [key, value] of Object.entries(mapping)) {
    const regex = new RegExp(`href="/${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
    content = content.replace(regex, `href="/${value}"`);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed all hrefs in sitemap.html to use .html files');

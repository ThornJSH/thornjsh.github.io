// SEO Conversion Script: Wrap sub-page HTML fragments as standalone pages
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://thornjsh.github.io';
const rootDir = __dirname;

const pages = {
  'home.html': ['홈', '사회복지사 정수홍의 포트폴리오. AI 활용 및 디지털 전환을 통해 사회복지 현장의 혁신을 돕습니다.'],
  'smart-welfare-tech.html': ['스마트복지기술', 'AI, 머신러닝, NLP 등 스마트 복지 기술을 활용한 사회복지 분야의 디지털 혁신 솔루션을 소개합니다.'],
  'smart-work.html': ['스마트워크', '사회복지 현장의 업무 효율화를 위한 스마트워크 도구와 방법론을 안내합니다.'],
  'smartwork-google-sheets.html': ['구글 스프레드시트', 'Google Sheets를 활용한 사회복지 실무 자동화 및 데이터 관리 가이드입니다.'],
  'sheets-examples.html': ['DX 스프레드 시트 예제', '사회복지 현장에서 바로 활용 가능한 Google Sheets DX 자동화 예제 모음입니다.'],
  'docs-manuals.html': ['DX Docs 매뉴얼', 'Google Docs를 활용한 문서 자동화 및 디지털 전환 매뉴얼입니다.'],
  'ai-courses.html': ['AI 활용 강좌', '사회복지사를 위한 AI 활용 강좌. Gemini, ChatGPT 등을 현장 업무에 적용하는 방법을 배웁니다.'],
  'busan-smart-welfare-agencies.html': ['부산 스마트복지 실천기관', '부산 지역 스마트복지 기술을 도입한 사회복지 실천기관 현황과 사례를 소개합니다.'],
  'for-social-workers.html': ['사회복지사를 위한 도구', '가계도, 생태도, 출퇴근관리 등 사회복지사의 실무를 돕는 디지털 도구 모음입니다.'],
  'with-ai.html': ['With AI', 'AI를 활용한 사회복지 업무 자동화 도구 모음. 프롬프트, 문서 검토, SNS 홍보문 생성 등을 지원합니다.'],
  'care-insight.html': ['Care Insight - AI 사례관리', '사회복지사를 위한 AI 사례관리 어시스턴트. 상담 기록 분석, 사례회의 보고서 생성을 지원합니다.'],
  'family_tree.html': ['가계도 그리기', '사회복지 실무에서 활용하는 가계도(Genogram) 그리기 웹 도구입니다.'],
  'ecomap.html': ['생태도 그리기', '클라이언트의 사회적 관계망을 시각화하는 생태도(Ecomap) 그리기 도구입니다.'],
  'gps-attendance.html': ['GPS 출퇴근관리', 'GPS 기반 사회복지시설 출퇴근 관리 시스템 안내 및 사용법입니다.'],
  'attendance-app.html': ['근태관리대장', '사회복지시설 근태관리를 위한 스프레드시트 기반 관리대장입니다.'],
  'table_styler.html': ['표 스타일 정리 도구', 'Google Sheets의 표 서식을 자동으로 정리하는 도구입니다.'],
  'sponsorship_form.html': ['후원신청서', '사회복지시설 후원신청서 자동화 도구입니다.'],
  'social-worker-calendar.html': ['사회복지시설 공통업무 캘린더', '사회복지시설의 연간 공통 업무 일정을 관리하는 캘린더 도구입니다.'],
  'ai-prompt-pro.html': ['AI Prompt Pro', '사회복지 현장에 최적화된 AI 프롬프트 작성 도구입니다.'],
  'sns-promotion.html': ['SNS 홍보문 만들기', 'AI를 활용하여 사회복지시설 SNS 홍보문을 자동 생성하는 도구입니다.'],
  'doc-audit.html': ['문서 타당성 검토', 'AI가 사회복지 문서의 타당성과 논리적 일관성을 검토합니다.'],
  'human-rights-docs.html': ['인권 지향적 글쓰기', '사회복지 문서에서 인권 지향적 표현을 사용하도록 AI가 검토하고 제안합니다.'],
  'ai-in-docs.html': ['Docs에서 AI 쓰기', 'Google Docs에서 AI를 활용하는 방법을 안내하는 가이드입니다.'],
  'ai-in-sheets.html': ['Sheet에서 AI 쓰기', 'Google Sheets에서 AI 함수를 활용하는 방법을 안내합니다.'],
  'ai-in-slides.html': ['Slide에서 AI 쓰기', 'Google Slides에서 AI를 활용한 프레젠테이션 제작 가이드입니다.'],
  'gemini-ppt.html': ['Gemini로 PPT 만들기', 'Google Gemini AI를 활용하여 전문적인 프레젠테이션을 제작하는 방법입니다.'],
  'sponsorship-consulting.html': ['후원 전략 컨설팅', 'AI를 활용한 사회복지시설 후원 전략 수립 및 컨설팅 도구입니다.'],
  'ai-chatbot.html': ['챗봇 (Chatbot)', '사회복지 현장을 위한 AI 챗봇 구축 가이드 및 활용 사례입니다.'],
  'emotion-prediction.html': ['Ct 정서 예측 모델', '클라이언트의 정서 상태를 예측하는 AI 모델 소개 및 활용법입니다.'],
  'mini-apps.html': ['Mini Apps', '사회복지 현장에서 바로 쓸 수 있는 미니 앱 모음입니다.'],
  'miniapp-windows-clock.html': ['윈도우 시계 설정', 'Windows 11 시계 및 시간 설정 관련 미니 유틸리티입니다.'],
  'miniapp-file-copy.html': ['시간조건 파일 복사', '시간 조건 기반 파일 자동 복사 유틸리티입니다.'],
  'miniapp-excel-password.html': ['엑셀 비밀번호 일괄변경', '여러 엑셀 파일의 비밀번호를 한 번에 변경하는 도구입니다.'],
  'miniapp-pdf-tool.html': ['PDF MultiTool', 'PDF 분할, 병합, 보호 기능을 제공하는 멀티 도구입니다.'],
  'miniapp-pdf-binder-web.html': ['PDF Binder (Web)', '웹 브라우저에서 PDF 파일을 병합하는 온라인 도구입니다.'],
  'miniapp-table-cleaner-web.html': ['Table Styler Web', '웹에서 표 서식을 깔끔하게 정리하는 도구입니다.'],
  'miniapp-pdf-flipbook.html': ['PDF 플립북', 'PDF 파일을 인터랙티브 플립북으로 변환하는 도구입니다.'],
  'miniapp-wlaw-search.html': ['법령 조문 검색', '키워드로 관련 법령 조문을 빠르게 검색하는 도구입니다.'],
  'miniapp-rhwp.html': ['HOP - HWP 문서 뷰어', '웹에서 HWP 한글 문서를 열어볼 수 있는 가벼운 뷰어입니다.'],
  'stats-overview.html': ['통계다루기', '사회복지 현장에서 필요한 통계 분석 방법론 개요입니다.'],
  'stats-basic.html': ['기초 통계 분석', '사회복지 연구 및 실무에 필요한 기초 통계 분석 가이드입니다.'],
  'stats-pre-post.html': ['사전-사후 비교 분석', '프로그램 효과 측정을 위한 사전-사후 비교 분석 도구입니다.'],
  'stats-ipa.html': ['IPA 분석 (Excel)', 'Excel을 활용한 IPA(Importance-Performance Analysis) 분석 도구입니다.'],
  'stats-methodology.html': ['분석방법론 탐색기', '연구 목적에 맞는 통계 분석 방법론을 탐색하고 선택할 수 있는 가이드입니다.'],
  'possibilities.html': ['이런 것도 가능해요', 'AI와 기술로 가능한 다양한 창의적 활용 사례를 소개합니다.'],
  'game-save-hippo.html': ['아기하마 구하기 게임', '재미있는 미니 게임 - 아기하마 구하기! 사회복지사를 위한 힐링 게임입니다.'],
  'possibilities-showcase.html': ['크리에이티브 쇼케이스', 'AI와 기술을 활용한 창의적 프로젝트 쇼케이스입니다.'],
  'faq.html': ['FAQ - 자주 묻는 질문', 'Smart Welfare Tech 서비스 이용에 관한 자주 묻는 질문과 답변입니다.'],
  'vibe-coding-philosophy.html': ['바이브 코딩 - 철학', '바이브 코딩의 철학과 접근 방식을 소개합니다.'],
  'vibe-coding-tips.html': ['바이브 코딩 - 활용팁', '바이브 코딩을 효과적으로 활용하기 위한 실전 팁 모음입니다.'],
  'idea-hub.html': ['열매똑똑 아이디어 HUB', '사회복지 현장의 혁신 아이디어를 공유하고 발전시키는 허브입니다.'],
  'faq-permission.html': ['초기설정 - 권한 설정', 'Google 서비스 초기 권한 설정 방법을 단계별로 안내합니다.'],
  'faq-make-copy.html': ['사본 만들기 가이드', 'Google 스프레드시트 및 문서의 사본을 만드는 방법 안내입니다.'],
  'faq-api-key.html': ['API 키 만들기', 'Google AI API 키를 생성하고 설정하는 방법을 안내합니다.'],
  'google-api-setup.html': ['구글 클라우드 설정', 'Google Cloud Platform 프로젝트 설정 및 API 활성화 가이드입니다.'],
  'qna.html': ['Q&A - 질문과 답변', '서비스 이용 중 궁금한 점에 대한 질문과 답변 게시판입니다.'],
  'sitemap.html': ['사이트맵', 'Smart Welfare Tech의 전체 페이지 구조를 한눈에 볼 수 있는 사이트맵입니다.'],
  'privacy.html': ['개인정보처리방침', 'Smart Welfare Tech의 개인정보 수집, 이용, 보호에 관한 방침입니다.'],
  'private-welfare-portal.html': ['민간복지 포털 구성(안)', '부산광역시 서구 내 민간 복지 서비스 통합 포털 구성 안내 및 프리뷰입니다.'],
  'useful-prompts.html': ['유용한 프롬프트', '사회복지 실무에서 바로 활용할 수 있는 유용한 AI 프롬프트 모음입니다.'],
  'explore-overview.html': ['함께보기', '사회복지 현장의 다양한 혁신 사례와 가능성을 함께 탐색하는 공간입니다.']
};

let convertedCount = 0;
let skippedCount = 0;

for (const [filename, [title, description]] of Object.entries(pages)) {
  const filePath = path.join(rootDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP: ${filename} (not found)`);
    skippedCount++;
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already converted (has id="header")
  if (content.includes('id="header"')) {
    console.log(`SKIP: ${filename} (already converted)`);
    skippedCount++;
    continue;
  }

  let cleanContent = content;
  if (cleanContent.includes('<body')) {
    const bodyMatch = cleanContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      cleanContent = bodyMatch[1].trim();
    }
  }

  const canonicalUrl = `${baseUrl}/${filename}`;
  const fullTitle = `${title} : Smart Welfare Tech`;
  // Escape quotes in description for HTML attributes
  const safeDesc = description.replace(/"/g, '&quot;');
  const safeTitle = title.replace(/"/g, '&quot;');

  const wrapper = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullTitle}</title>
  <meta name="description" content="${safeDesc}">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${fullTitle}">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:image" content="${baseUrl}/images/thorn.png">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${fullTitle}">
  <meta name="twitter:description" content="${safeDesc}">

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "${safeTitle}",
    "url": "${canonicalUrl}",
    "description": "${safeDesc}",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Smart Welfare Tech",
      "url": "${baseUrl}/"
    }
  }
  </script>

  <link rel="stylesheet" href="/style.css">
  <meta name="google-adsense-account" content="ca-pub-3084207140786791">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3084207140786791" crossorigin="anonymous"></script>
</head>
<body>
  <div id="header"></div>

  <section class="page-header">
    <div class="overlay"></div>
    <div class="header-content">
      <h1 id="dynamic-title">${title}</h1>
      <div class="title-underline"></div>
    </div>
  </section>

  <main class="main-content">
    <div class="layout-wrapper">
      <aside class="ad-sidebar left-ad">
        <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3084207140786791" data-ad-slot="LEFT_AD_SLOT" data-ad-format="auto" data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </aside>

      <div class="container" id="page-body">
        <!--CONTENT_START-->
${cleanContent}
        <!--CONTENT_END-->
      </div>

      <aside class="ad-sidebar right-ad">
        <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3084207140786791" data-ad-slot="RIGHT_AD_SLOT" data-ad-format="auto" data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </aside>
    </div>
  </main>

  <div id="footer"></div>

  <script type="module" src="/main.js"></script>
</body>
</html>
`;

  fs.writeFileSync(filePath, wrapper, 'utf8');
  convertedCount++;
  console.log(`OK: ${filename} -> ${title}`);
}

console.log(`\n=== Conversion complete: ${convertedCount} converted, ${skippedCount} skipped ===`);

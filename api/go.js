/**
 * Vercel Serverless Function: Redirects to NotebookLM URLs
 * 환경 변수 NOTEBOOK1, NOTEBOOK2, NOTEBOOK3를 사용하여 리다이렉트합니다.
 */
export default function handler(req, res) {
  // URL 파라미터에서 id 값을 가져옵니다. (예: /api/go?id=1)
  const { id } = req.query;

  // Vercel Environment Variables와 매핑
  const notebookMap = {
    '1': process.env.NOTEBOOK1, // 업무담당자 찾기
    '2': process.env.NOTEBOOK2, // 남구조례
    '3': process.env.NOTEBOOK3  // 메인 챗봇 (기본값)
  };

  // 요청한 id에 해당하는 URL 선택 (없으면 기본으로 NOTEBOOK3 선택)
  const targetUrl = notebookMap[id] || process.env.NOTEBOOK3;

  // 만약 환경변수 자체가 설정되지 않은 경우 에러 처리
  if (!targetUrl) {
    return res.status(500).json({
      error: "Redirect URL이 설정되지 않았습니다. Vercel 환경 변수를 확인하세요."
    });
  }

  // 302 리다이렉트를 통해 실제 NotebookLM 주소로 이동
  // 브라우저 소스 보기에서는 이 목적지 주소가 노출되지 않습니다.
  res.redirect(302, targetUrl);
}
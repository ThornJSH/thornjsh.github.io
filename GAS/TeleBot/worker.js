/**
 * dobiseo-relay — 텔레그램 → Apps Script 중계 (Cloudflare Worker)
 *
 * 하는 일
 *  1) 텔레그램이 보낸 메시지를 받으면 즉시 "ok"(200)로 응답 → 텔레그램이 재전송하지 않음
 *  2) 같은 내용을 Apps Script 웹앱(doPost)으로 넘김 (비밀키를 붙여서)
 *
 * Worker 설정 → Variables and Secrets 에 등록할 값
 *  · GAS_URL   (Text)   : Apps Script 웹앱 주소 (…/exec)
 *  · TG_SECRET (Secret) : Apps Script에서 createRelaySecret() 실행 시 나온 비밀키
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 상태 확인용 (브라우저로 열면 ok)
    if (request.method !== 'POST' || url.pathname !== '/telegram') {
      return new Response('ok', { status: 200 });
    }

    // 텔레그램이 보낸 요청인지 확인 (setWebhook 때 등록한 secret_token)
    if (!env.TG_SECRET || request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== env.TG_SECRET) {
      return new Response('forbidden', { status: 403 });
    }

    const body = await request.text();

    // Apps Script로 넘기기 — 응답을 기다리지 않고 텔레그램에는 바로 200
    // (Apps Script는 302로 응답하므로 따라가지 않음: redirect 'manual')
    ctx.waitUntil(
      fetch(env.GAS_URL + '?key=' + encodeURIComponent(env.TG_SECRET), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
        redirect: 'manual'
      }).catch(err => console.log('GAS 전달 실패: ' + err))
    );

    return new Response('ok', { status: 200 });
  }
};

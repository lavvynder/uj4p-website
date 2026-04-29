export async function onRequestGet(context) {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = context.env;
  const url = new URL(context.request.url);
  const code = url.searchParams.get("code");

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent": "cloudflare-pages-functions",
      accept: "application/json",
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const result = await response.json();
  const token = result.access_token;

  const content = `
    <html><body><script>
      (function() {
        function receiveMessage(e) {
          window.opener.postMessage('authorization:github:success:${JSON.stringify({token, provider: 'github'})}', e.origin);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })()
    </script></body></html>`;

  return new Response(content, { headers: { "content-type": "text/html" } });
}

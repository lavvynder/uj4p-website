export async function onRequestGet(context) {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = context.env;
  const code = new URL(context.request.url).searchParams.get("code");

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json",
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const result = await response.json();
  const token = result.access_token;

  // This script sends the token back to the CMS in your browser
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

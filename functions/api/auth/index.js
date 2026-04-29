export async function onRequestGet(context) {
  // This line pulls the ID you just saved in Cloudflare Settings
  const { GITHUB_CLIENT_ID } = context.env; 
  
  if (!GITHUB_CLIENT_ID) {
    return new Response("Missing GITHUB_CLIENT_ID", { status: 500 });
  }

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", GITHUB_CLIENT_ID);
  url.searchParams.set("scope", "repo,user");
  
  return Response.redirect(url.toString(), 302);
}

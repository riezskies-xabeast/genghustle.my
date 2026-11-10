export async function onRequest(context) {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const githubFileUrl = "https://api.github.com/repos/riezskies-xabeast/genghustle.my/contents/data/vendors.json";

  try {
    if (request.method === "GET") {
      const ghRes = await fetch(githubFileUrl + "?t=" + Date.now(), {
        headers: {
          "Accept": "application/vnd.github+json",
          "Authorization": `Bearer ${env.GH_TOKEN}`,
          "User-Agent": "GengHustle-App"
        }
      });
      const data = await ghRes.text();
      return new Response(data, {
        status: ghRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (request.method === "PUT") {
      const payload = await request.text();
      const ghRes = await fetch(githubFileUrl, {
        method: "PUT",
        headers: {
          "Accept": "application/vnd.github+json",
          "Authorization": `Bearer ${env.GH_TOKEN}`,
          "User-Agent": "GengHustle-App",
          "Content-Type": "application/json"
        },
        body: payload
      });
      const data = await ghRes.text();
      return new Response(data, {
        status: ghRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}

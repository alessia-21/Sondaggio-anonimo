export async function onRequestGet({ request, env }) {
  const auth = request.headers.get("Authorization") || "";
  if (!env.ADMIN_TOKEN || auth !== `Bearer ${env.ADMIN_TOKEN}`)
    return Response.json({error:"Non autorizzato"}, {status:401});
  const rows = await env.DB.prepare("SELECT choice, COUNT(*) AS n FROM votes GROUP BY choice").all();
  const counts = {A:0,B:0,C:0};
  for (const row of rows.results || []) counts[row.choice] = row.n;
  return Response.json({counts,total:counts.A+counts.B+counts.C});
}
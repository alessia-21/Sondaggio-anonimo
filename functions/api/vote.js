export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return Response.json({error:"Richiesta non valida"}, {status:400}); }
  const choice = body?.choice;
  const token = request.headers.get("X-Voter-Token") || "";
  if (!["A","B","C"].includes(choice) || !/^[a-f0-9]{64}$/.test(token))
    return Response.json({error:"Dati non validi"}, {status:400});
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  const voterHash = [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,"0")).join("");
  try {
    await env.DB.prepare("INSERT INTO votes (voter_hash, choice, created_at) VALUES (?, ?, datetime('now'))")
      .bind(voterHash, choice).run();
    return Response.json({ok:true});
  } catch (e) {
    if (String(e).includes("UNIQUE")) return Response.json({error:"Hai già votato"}, {status:409});
    return Response.json({error:"Errore del server"}, {status:500});
  }
}
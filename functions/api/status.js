export async function onRequestGet({ request, env }) {
  const token = request.headers.get("X-Voter-Token") || "";
  if (!/^[a-f0-9]{64}$/.test(token)) return Response.json({voted:false});
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  const hash = [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,"0")).join("");
  const row = await env.DB.prepare("SELECT 1 AS found FROM votes WHERE voter_hash = ?").bind(hash).first();
  return Response.json({voted:!!row});
}
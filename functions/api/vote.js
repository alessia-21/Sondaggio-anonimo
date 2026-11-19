import {json,getPoll} from "./_utils.js";
export async function onRequestPost({request,env}){
 let body;try{body=await request.json()}catch{return json({error:"Richiesta non valida"},400)}
 const choice=body?.choice,token=request.headers.get("X-Voter-Token")||"";
 if(!["A","B","C"].includes(choice)||!/^[a-f0-9]{64}$/.test(token))return json({error:"Dati non validi"},400);
 if(!(await getPoll(env)))return json({error:"Sondaggio non attivo"},423);
 const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(token));
 const hash=[...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,"0")).join("");
 try{await env.DB.prepare("INSERT INTO votes(voter_hash,choice,created_at) VALUES(?,?,datetime('now'))").bind(hash,choice).run();return json({ok:true})}
 catch(e){if(String(e).includes("UNIQUE"))return json({error:"Hai già votato"},409);return json({error:"Errore del server"},500)}
}

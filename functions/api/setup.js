import {json,authorized,getPoll} from "./_utils.js";
export async function onRequestPost({request,env}){
 if(!authorized(request,env))return json({error:"Non autorizzato"},401);
 if(await getPoll(env))return json({error:"Esiste già un sondaggio. Azzera prima quello attuale."},409);
 let body;try{body=await request.json()}catch{return json({error:"Richiesta non valida"},400)}
 const options=body?.options;if(!Array.isArray(options)||options.length!==3||options.some(x=>typeof x!=="string"||!x.trim()||x.length>200))return json({error:"Inserisci esattamente tre opzioni, massimo 200 caratteri ciascuna."},400);
 const shuffled=options.map(x=>x.trim());
 for(let i=shuffled.length-1;i>0;i--){const j=crypto.getRandomValues(new Uint32Array(1))[0]%(i+1);[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]]}
 await env.DB.prepare("INSERT INTO poll_config(id,a_option,b_option,c_option,created_at) VALUES(1,?,?,?,datetime('now'))").bind(shuffled[0],shuffled[1],shuffled[2]).run();
 return json({ok:true})
}

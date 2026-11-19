import {json,authorized} from "./_utils.js";
export async function onRequestGet({request,env}){
 if(!authorized(request,env))return json({error:"Non autorizzato"},401);
 const rows=await env.DB.prepare("SELECT choice,COUNT(*) AS n FROM votes GROUP BY choice").all(),counts={A:0,B:0,C:0};
 for(const r of rows.results||[])counts[r.choice]=r.n;
 return json({counts,total:counts.A+counts.B+counts.C})
}

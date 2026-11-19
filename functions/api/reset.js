import {json,authorized} from "./_utils.js";
export async function onRequestPost({request,env}){
 if(!authorized(request,env))return json({error:"Non autorizzato"},401);
 await env.DB.batch([env.DB.prepare("DELETE FROM votes"),env.DB.prepare("DELETE FROM poll_config")]);return json({ok:true})
}

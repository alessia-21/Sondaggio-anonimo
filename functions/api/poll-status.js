import {json,getPoll} from "./_utils.js";
export async function onRequestGet({env}){return json({configured:!!(await getPoll(env))})}

export const json=(data,status=200)=>Response.json(data,{status});
export const authorized=(request,env)=>!!env.ADMIN_TOKEN&&request.headers.get("Authorization")===`Bearer ${env.ADMIN_TOKEN}`;
export const getPoll=env=>env.DB.prepare("SELECT id FROM poll_config WHERE id=1").first();

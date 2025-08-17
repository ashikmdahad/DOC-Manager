const db=require('../db'); async function notify(userId,type,message,payload={}){
  await db.query(`INSERT INTO notifications(user_id,type,message,payload) VALUES($1,$2,$3,$4)`,
  [userId,type,message,JSON.stringify(payload)]);} module.exports={notify};

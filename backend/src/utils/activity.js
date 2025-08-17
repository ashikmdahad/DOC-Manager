const db=require('../db'); async function logActivity(userId,action,entity,entityId,details={}){
  await db.query(`INSERT INTO activity_logs(user_id,action,entity,entity_id,details) VALUES($1,$2,$3,$4,$5)`,
  [userId,action,entity,entityId,JSON.stringify(details)]);} module.exports={logActivity};

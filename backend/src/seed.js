const db=require('./db'); const bcrypt=require('bcrypt');
module.exports=async function(){ const r=await db.query('SELECT COUNT(*)::int c FROM users'); if(r.rows[0].c>0) return;
const pass=await bcrypt.hash('DemoPass123!',10);
await db.query(`INSERT INTO users(email,password,role) VALUES ('admin@demo.local',$1,'admin'),('editor@demo.local',$1,'editor'),('viewer@demo.local',$1,'viewer')`,[pass]);
const u=await db.query("SELECT id FROM users WHERE email='admin@demo.local'"); const uid=u.rows[0].id;
await db.query("INSERT INTO folders(name,owner_id) VALUES('Projects',$1),('Invoices',$1)",[uid]);
console.log('Seeded demo data'); }

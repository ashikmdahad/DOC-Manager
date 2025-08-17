const express=require('express'); const db=require('../db'); const {requireAuth}=require('../middleware/auth'); const {logActivity}=require('../utils/activity'); const router=express.Router();
router.get('/',requireAuth,async(req,res)=>{ const r=await db.query('SELECT * FROM folders WHERE owner_id=$1 ORDER BY id DESC',[req.user.id]); res.json(r.rows); });
router.post('/',requireAuth,async(req,res)=>{ const {name,parent_id}=req.body||{}; const r=await db.query('INSERT INTO folders(name,parent_id,owner_id) VALUES($1,$2,$3) RETURNING *',[name||'New Folder',parent_id||null,req.user.id]); await logActivity(req.user.id,'create','folder',r.rows[0].id,{name}); res.status(201).json(r.rows[0]); });
router.patch('/:id',requireAuth,async(req,res)=>{ const {name}=req.body||{}; const r=await db.query('UPDATE folders SET name=$1 WHERE id=$2 AND owner_id=$3 RETURNING *',[name,req.params.id,req.user.id]); res.json(r.rows[0]); });
router.delete('/:id',requireAuth,async(req,res)=>{ await db.query('DELETE FROM folders WHERE id=$1 AND owner_id=$2',[req.params.id,req.user.id]); res.json({ok:true}); });
module.exports=router;

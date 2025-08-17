const express=require('express'); const db=require('../db'); const {requireAuth}=require('../middleware/auth'); const {logActivity}=require('../utils/activity'); const router=express.Router();
router.get('/:document_id',requireAuth,async(req,res)=>{ const r=await db.query('SELECT c.*,u.email FROM comments c JOIN users u ON u.id=c.user_id WHERE document_id=$1 ORDER BY c.id ASC',[req.params.document_id]); res.json(r.rows); });
router.post('/',requireAuth,async(req,res)=>{ const {document_id,body}=req.body||{}; const r=await db.query('INSERT INTO comments(document_id,user_id,body) VALUES($1,$2,$3) RETURNING *',[document_id,req.user.id,body]); await logActivity(req.user.id,'comment','document',document_id,{body}); res.status(201).json(r.rows[0]); });
module.exports=router;

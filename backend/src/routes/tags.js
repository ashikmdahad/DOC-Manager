const express=require('express'); const db=require('../db'); const {requireAuth}=require('../middleware/auth'); const router=express.Router();
router.get('/',requireAuth,async(req,res)=>{ const r=await db.query('SELECT * FROM tags ORDER BY name ASC'); res.json(r.rows); });
router.post('/',requireAuth,async(req,res)=>{ const {name}=req.body||{}; const r=await db.query('INSERT INTO tags(name) VALUES($1) ON CONFLICT(name) DO UPDATE SET name=EXCLUDED.name RETURNING *',[name]); res.status(201).json(r.rows[0]); });
module.exports=router;

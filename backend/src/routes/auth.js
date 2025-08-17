const express=require('express'); const bcrypt=require('bcrypt'); const jwt=require('jsonwebtoken'); const speakeasy=require('speakeasy'); const qrcode=require('qrcode'); const {z}=require('zod'); const db=require('../db'); const {requireAuth,requireRole}=require('../middleware/auth');
const router=express.Router(); const schema=z.object({email:z.string().email(),password:z.string().min(6)});
router.post('/signup',async(req,res)=>{ const p=schema.safeParse(req.body); if(!p.success) return res.status(400).json(p.error); const {email,password}=p.data; const hash=await bcrypt.hash(password,10);
  try{ const r=await db.query('INSERT INTO users(email,password,role) VALUES($1,$2,$3) RETURNING id,email,role',[email,hash,'editor']); res.status(201).json(r.rows[0]); }catch(e){ res.status(400).json({error:e.message}); }});
router.post('/login',async(req,res)=>{ const p=schema.safeParse(req.body); if(!p.success) return res.status(400).json(p.error); const {email,password}=p.data; const r=await db.query('SELECT * FROM users WHERE email=$1',[email]); if(!r.rows.length) return res.status(401).json({error:'Invalid creds'});
  const user=r.rows[0]; const ok=await bcrypt.compare(password,user.password); if(!ok) return res.status(401).json({error:'Invalid creds'});
  if(process.env.TWOFA_ENABLED==='true' && user.twofa_secret){ return res.json({twofa_required:true,user_id:user.id}); }
  const token=jwt.sign({id:user.id,email:user.email,role:user.role},process.env.JWT_SECRET,{expiresIn:'8h'}); res.json({token}); });
router.post('/2fa/enable',requireAuth,async(req,res)=>{ const secret=speakeasy.generateSecret({name:'DocManager'}); await db.query('UPDATE users SET twofa_secret=$1 WHERE id=$2',[secret.base32,req.user.id]); const qr=await qrcode.toDataURL(secret.otpauth_url); res.json({otpauth_url:secret.otpauth_url,qrcode:qr}); });
router.post('/2fa/verify',async(req,res)=>{ const {user_id,token}=req.body||{}; if(!user_id||!token) return res.status(400).json({error:'Missing'}); const r=await db.query('SELECT * FROM users WHERE id=$1',[user_id]); if(!r.rows.length) return res.status(404).json({error:'Not found'});
  const user=r.rows[0]; const ok=speakeasy.totp.verify({secret:user.twofa_secret,encoding:'base32',token}); if(!ok) return res.status(401).json({error:'Invalid 2FA'});
  const jwtToken=jwt.sign({id:user.id,email:user.email,role:user.role},process.env.JWT_SECRET,{expiresIn:'8h'}); res.json({token:jwtToken}); });
router.get('/me',requireAuth,async(req,res)=>{ const r=await db.query('SELECT id,email,role,created_at FROM users WHERE id=$1',[req.user.id]); res.json(r.rows[0]); });
router.get('/admin/users',requireAuth,requireRole('admin'),async(req,res)=>{ const r=await db.query('SELECT id,email,role,created_at FROM users ORDER BY id DESC'); res.json(r.rows); });
module.exports=router;

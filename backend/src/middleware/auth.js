const jwt = require('jsonwebtoken'); require('dotenv').config();
function requireAuth(req,res,next){ const h=req.headers.authorization||''; const t=h.startsWith('Bearer ')?h.slice(7):null;
  if(!t) return res.status(401).json({error:'Missing token'}); try{ req.user=jwt.verify(t,process.env.JWT_SECRET); next(); }
  catch{ return res.status(401).json({error:'Invalid token'});} }
function requireRole(...roles){ return (req,res,next)=>{ if(!req.user || !roles.includes(req.user.role)) return res.status(403).json({error:'Forbidden'}); next(); } }
module.exports = { requireAuth, requireRole };

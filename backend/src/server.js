require('dotenv').config(); const express=require('express'); const cors=require('cors'); const helmet=require('helmet');
const fs=require('fs'); const path=require('path'); const db=require('./db');
const authRoutes=require('./routes/auth'); const filesRoutes=require('./routes/files'); const foldersRoutes=require('./routes/folders');
const tagsRoutes=require('./routes/tags'); const sharesRoutes=require('./routes/shares'); const commentsRoutes=require('./routes/comments');
const app=express(); app.use(express.json({limit:'25mb'})); app.use(helmet()); app.use(cors({origin:process.env.FRONTEND_ORIGIN?.split(',')||'*'}));
app.get('/api/health',(_,res)=>res.json({ok:true}));
app.use('/api/auth',authRoutes); app.use('/api/files',filesRoutes); app.use('/api/folders',foldersRoutes);
app.use('/api/tags',tagsRoutes); app.use('/api/shares',sharesRoutes); app.use('/api/comments',commentsRoutes);
async function init(){ const schema=fs.readFileSync(path.join(__dirname,'schema.sql'),'utf8'); await db.query(schema); if(process.env.SEED==='true'){ await require('./seed')(); } }
const port=process.env.PORT||3001; init().then(()=>app.listen(port,()=>console.log('API on',port))).catch(e=>{console.error(e);process.exit(1)});

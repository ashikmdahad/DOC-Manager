import React, { useEffect, useState } from 'react'
import api, { setToken } from '../api'
import Folders from './Folders'
import Share from './Share'
import Tags from './Tags'
import VersionHistory from './VersionHistory'
import Comments from './Comments'
import Notifications from './Notifications'
import Trash from './Trash'
import ActivityLog from './ActivityLog'

function AuthView({ onAuthed }){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [twofa,setTwofa]=useState(''); const [pending,setPending]=useState(null);
  const signup=async()=>{ await api.post('/auth/signup',{email,password}); alert('Signed up. Now log in.'); }
  const login=async()=>{
    const {data}=await api.post('/auth/login',{email,password});
    if(data.twofa_required) {
      setPending(data.user_id);
    } else {
      localStorage.setItem('token',data.token);
      setToken(data.token);
      window.dispatchEvent(new Event('authchange'));
    }
  }
  const verify=async()=>{ const {data}=await api.post('/auth/2fa/verify',{user_id:pending,token:twofa}); localStorage.setItem('token',data.token); setToken(data.token); onAuthed(); }
  return (<div className="min-h-screen grid place-items-center"><div className="card w-full max-w-sm space-y-3">
    <h1 className="text-xl font-semibold">Sign in</h1>
    <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
    <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
    {!pending?(<div className="flex gap-2"><button className="btn" onClick={login}>Log in</button><button className="btn-secondary" onClick={signup}>Sign up</button></div>):
      (<div className="space-y-2"><input className="input" placeholder="2FA Code" value={twofa} onChange={e=>setTwofa(e.target.value)}/><button className="btn" onClick={verify}>Verify</button></div>)}
  </div></div>)
}

function UploadBar({ onUploaded }){
  const [file,setFile]=useState(null)
  const upload=async()=>{ const form=new FormData(); form.append('file',file); await api.post('/files/upload',form,{headers:{'Content-Type':'multipart/form-data'}}); setFile(null); onUploaded&&onUploaded(); }
  return (<div className="card flex items-center gap-2"><input className="text-sm" type="file" onChange={e=>setFile(e.target.files?.[0])}/><button className="btn" disabled={!file} onClick={upload}>Upload</button></div>)
}

function DocList(){
  const [docs,setDocs]=useState([]);
  const [q,setQ]=useState('');
  const [type, setType] = useState('');
  const [tags, setTags] = useState('');
  const [fts, setFts] = useState('');
  const [sharingFileId, setSharingFileId] = useState(null);
  const [taggingFileId, setTaggingFileId] = useState(null);
  const [versionHistoryFileId, setVersionHistoryFileId] = useState(null);
  const [commentingFileId, setCommentingFileId] = useState(null);

  const fetchDocs=async()=>{
    const {data}=await api.get('/files',{params:{q, type, tags, fts}});
    setDocs(data)
  };

  useEffect(()=>{
    fetchDocs()
  },[])

  return (<div className="space-y-4">
    <div className="flex gap-2">
      <input className="input" placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)}/>
      <input className="input" placeholder="Type..." value={type} onChange={e=>setType(e.target.value)}/>
      <input className="input" placeholder="Tags..." value={tags} onChange={e=>setTags(e.target.value)}/>
      <input className="input" placeholder="Full-text search..." value={fts} onChange={e=>setFts(e.target.value)}/>
      <button className="btn" onClick={fetchDocs}>Search</button>
    </div>
    <UploadBar onUploaded={fetchDocs}/>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {docs.map(d=>(<div key={d.id} className="card space-y-2">
        <div className="font-semibold">{d.name}</div>
        <div className="text-xs text-zinc-400">Versions: {d.versions}</div>
        <div className="flex gap-2">
          <button className="btn" onClick={async()=>{ const {data}=await api.get(`/files/${d.id}/download`); window.open(data.url,'_blank'); }}>Download</button>
          <button className="btn-secondary" onClick={() => setSharingFileId(sharingFileId === d.id ? null : d.id)}>Share</button>
          <button className="btn-secondary" onClick={() => setTaggingFileId(taggingFileId === d.id ? null : d.id)}>Tags</button>
          <button className="btn-secondary" onClick={() => setVersionHistoryFileId(versionHistoryFileId === d.id ? null : d.id)}>Versions</button>
          <button className="btn-secondary" onClick={() => setCommentingFileId(commentingFileId === d.id ? null : d.id)}>Comments</button>
          <button className="btn-secondary" onClick={async()=>{ await api.delete(`/files/${d.id}`); fetchDocs(); }}>Delete</button>
        </div>
        {sharingFileId === d.id && <Share fileId={d.id} />}
        {taggingFileId === d.id && <Tags fileId={d.id} />}
        {versionHistoryFileId === d.id && <VersionHistory fileId={d.id} />}
        {commentingFileId === d.id && <Comments fileId={d.id} />}
      </div>))}
    </div>
  </div>)
}

export default function App(){
  const [token, setTokenState] = useState(localStorage.getItem('token'));
  const [showTrash, setShowTrash] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  useEffect(() => {
    const onAuthChange = () => {
      setTokenState(localStorage.getItem('token'));
    };
    window.addEventListener('authchange', onAuthChange);
    return () => {
      window.removeEventListener('authchange', onAuthChange);
    };
  }, []);

  useEffect(() => {
    setToken(token);
  }, [token]);

  if (!token) return <AuthView />;

  return (
    <div className="min-h-screen">
      <Notifications />
      <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <div className="font-semibold">Document Manager</div>
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={() => setShowActivityLog(!showActivityLog)}>Activity Log</button>
            <button className="btn-secondary" onClick={() => setShowTrash(!showTrash)}>Trash</button>
            <button
              className="btn-secondary"
              onClick={() => {
                localStorage.removeItem('token');
                setTokenState(null);
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {showTrash ? <Trash /> : showActivityLog ? <ActivityLog /> : (
          <>
            <Folders />
            <DocList />
          </>
        )}
      </main>
      <footer className="text-center py-6 text-xs text-zinc-500">
        © Demo
      </footer>
    </div>
  );
}

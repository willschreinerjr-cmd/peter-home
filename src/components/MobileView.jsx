/**
 * MobileView — Dashboard Editor
 *
 * Shown on phones / tablets (≤768 px). Lets Peter manage what
 * appears on the kiosk display screen:
 *
 *   📸 Slideshow Photos  — add / remove photo URLs
 *   💪 Workout Schedule  — build a weekly workout plan
 *
 * Changes are held locally in state and only committed when
 * "Push to Dashboard" is tapped. That commits the new data.json
 * to GitHub, triggering an auto-deploy (~2 min) so the big
 * screen picks up the changes automatically.
 *
 * The GitHub Personal Access Token is stored only in the phone's
 * own localStorage — it is never sent anywhere except GitHub.com.
 */

import { useState, useEffect, useRef } from 'react'
import { settings } from '../config/settings'
import { saveToDashboard, uploadPhoto } from '../hooks/useDashboardData'

const DRAFT_PHOTOS_KEY   = 'peter_draft_photos_v2'
const DRAFT_WORKOUTS_KEY = 'peter_draft_workouts_v2'
const TOKEN_KEY          = 'peter_github_token_v1'
const DAYS               = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

function readJson(key, fallback) {
  try { const v = localStorage.getItem(key); if (v !== null) return JSON.parse(v) } catch {}
  return fallback
}
function writeJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7) }

const gold   = '#c8a96e'
const cream  = '#f0e4ce'
const dim    = '#7a5e42'
const dimmer = '#5a4030'
const glass  = 'rgba(14,8,2,0.72)'
const bdr    = 'rgba(180,108,42,0.22)'

function Card({ children, style }) {
  return (
    <div style={{ margin:'0 14px', background:glass, border:`1px solid ${bdr}`, borderRadius:'14px', backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)', overflow:'hidden', ...style }}>
      {children}
    </div>
  )
}

function SectionHead({ emoji, label, count }) {
  return (
    <div style={{ padding:'13px 16px 11px', borderBottom:`1px solid rgba(180,108,42,0.14)`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <p style={{ fontSize:'0.65rem', fontWeight:700, color:'rgba(200,169,110,0.85)', textTransform:'uppercase', letterSpacing:'0.18em' }}>{emoji}&ensp;{label}</p>
      {count != null && <span style={{ fontSize:'0.6rem', color:dim, background:'rgba(180,108,42,0.10)', border:`1px solid rgba(180,108,42,0.18)`, borderRadius:'99px', padding:'1px 8px' }}>{count}</span>}
    </div>
  )
}

const inputBase = { background:'rgba(255,255,255,0.04)', border:`1px solid rgba(180,108,42,0.22)`, borderRadius:'8px', padding:'10px 12px', color:cream, fontSize:'0.88rem', outline:'none', width:'100%', boxSizing:'border-box', WebkitAppearance:'none', appearance:'none' }

function Input({ label, hint, value, onChange, placeholder, type='text' }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
      {label && <label style={{ fontSize:'0.60rem', color:dim, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' }}>{label}</label>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={inputBase}
        onFocus={e=>(e.target.style.borderColor='rgba(200,169,110,0.55)')}
        onBlur={e=>(e.target.style.borderColor='rgba(180,108,42,0.22)')} />
      {hint && <p style={{ fontSize:'0.59rem', color:dimmer, lineHeight:1.5 }}>{hint}</p>}
    </div>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
      {label && <label style={{ fontSize:'0.60rem', color:dim, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' }}>{label}</label>}
      <select value={value} onChange={e=>onChange(e.target.value)} style={{ ...inputBase, background:'rgba(18,10,4,0.92)' }}>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function Btn({ children, onClick, variant='default', disabled, full }) {
  const v = { default:{ bg:'rgba(200,169,110,0.10)', border:'rgba(200,169,110,0.28)', color:gold }, primary:{ bg:'rgba(200,169,110,0.18)', border:'rgba(200,169,110,0.45)', color:'#e2c896' }, ghost:{ bg:'transparent', border:'transparent', color:dim } }[variant] || {}
  return (
    <button onClick={onClick} disabled={disabled} style={{ padding:'9px 15px', borderRadius:'8px', border:`1px solid ${v.border}`, background:v.bg, color:v.color, fontSize:'0.80rem', fontWeight:600, cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.5:1, letterSpacing:'0.03em', minHeight:'38px', display:'inline-flex', alignItems:'center', gap:'5px', WebkitAppearance:'none', width:full?'100%':undefined, justifyContent:full?'center':undefined }}>
      {children}
    </button>
  )
}

function DeleteBtn({ onClick }) {
  return (
    <button onClick={onClick} aria-label="Remove" style={{ flexShrink:0, width:28, height:28, borderRadius:'50%', border:'1px solid rgba(248,113,113,0.22)', background:'rgba(248,113,113,0.06)', color:'#f87171', fontSize:'1rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}>x</button>
  )
}

function Divider() { return <div style={{ height:'1px', background:'rgba(180,108,42,0.10)' }} /> }

function AddFormWrap({ children }) {
  return <div style={{ padding:'14px 16px', borderTop:`1px solid rgba(200,169,110,0.10)`, background:'rgba(200,169,110,0.025)', display:'flex', flexDirection:'column', gap:'10px' }}>{children}</div>
}

function PhotoRow({ photo, onDelete }) {
  return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:11, padding:'10px 16px' }}>
        <div style={{ width:46, height:46, flexShrink:0, borderRadius:'8px', overflow:'hidden', background:'rgba(255,255,255,0.04)', border:`1px solid ${bdr}` }}>
          <img src={photo.url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.opacity='0.2'}} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:'0.83rem', color:cream, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{photo.title||'Photo'}</p>
          {photo.caption && <p style={{ fontSize:'0.68rem', color:dim, marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{photo.caption}</p>}
        </div>
        <button onClick={()=>onDelete(photo.id)} style={{ flexShrink:0, padding:'6px 12px', borderRadius:'7px', border:'1px solid rgba(248,113,113,0.35)', background:'rgba(248,113,113,0.08)', color:'#f87171', fontSize:'0.72rem', fontWeight:600, cursor:'pointer', letterSpacing:'0.03em' }}>
          Remove
        </button>
      </div>
      <Divider />
    </>
  )
}

function AddPhotoForm({ onAdd, onCancel, token }) {
  const [url,setUrl]=useState('')
  const [title,setTitle]=useState('')
  const [caption,setCaption]=useState('')
  const [uploading,setUploading]=useState(false)
  const [uploadErr,setUploadErr]=useState('')
  const fileRef=useRef()

  const handleFile=async(e)=>{
    const file=e.target.files?.[0]; if(!file) return
    setUploadErr('')
    if(!token){setUploadErr('Save your GitHub token first — needed to upload photos.');return}
    setUploading(true)
    try{
      const photoUrl=await uploadPhoto(file,token)
      setUrl(photoUrl)
      if(!title) setTitle(file.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' '))
    }catch(err){ setUploadErr(err.message) }
    finally{ setUploading(false); e.target.value='' }
  }

  const submit=()=>{ const u=url.trim(); if(!u) return; onAdd({id:uid(),url:u,title:title.trim(),caption:caption.trim()}); setUrl('');setTitle('');setCaption('') }

  return (
    <AddFormWrap>
      {/* Hidden native file input — triggers Apple Photos picker on iOS */}
      <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleFile} />

      {/* Camera-roll upload button */}
      <button
        onClick={()=>fileRef.current?.click()}
        disabled={uploading}
        style={{ width:'100%', padding:'13px', borderRadius:'10px', border:`1px solid rgba(200,169,110,0.35)`, background:'rgba(200,169,110,0.08)', color:uploading?dim:gold, fontSize:'0.88rem', fontWeight:700, cursor:uploading?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, letterSpacing:'0.02em' }}
      >
        {uploading ? '⏳ Uploading...' : '📷  Choose from Camera Roll'}
      </button>

      {uploadErr && <p style={{fontSize:'0.68rem',color:'#f87171'}}>{uploadErr}</p>}

      {/* URL preview thumbnail (shown once a URL is set) */}
      {url && (
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:48,height:48,flexShrink:0,borderRadius:8,overflow:'hidden',border:`1px solid ${bdr}` }}>
            <img src={url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />
          </div>
          <p style={{fontSize:'0.65rem',color:dim,flex:1,wordBreak:'break-all',lineHeight:1.4}}>{url}</p>
          <DeleteBtn onClick={()=>setUrl('')} />
        </div>
      )}

      {/* Divider + manual URL fallback */}
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <div style={{flex:1,height:1,background:'rgba(180,108,42,0.15)'}} />
        <span style={{fontSize:'0.60rem',color:dimmer,letterSpacing:'0.06em'}}>OR PASTE A URL</span>
        <div style={{flex:1,height:1,background:'rgba(180,108,42,0.15)'}} />
      </div>
      <Input value={url} onChange={setUrl} placeholder="https://..." />

      <Input label="Title" value={title} onChange={setTitle} placeholder="e.g. Summer at the cabin" />
      <Input label="Caption" value={caption} onChange={setCaption} placeholder="Optional subtitle" />
      <div style={{ display:'flex', gap:8 }}><Btn onClick={submit} variant="primary" disabled={!url.trim()||uploading}>Add Photo</Btn><Btn onClick={onCancel} variant="ghost">Cancel</Btn></div>
    </AddFormWrap>
  )
}

function WorkoutRow({ workout, onDelete }) {
  return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:11, padding:'10px 16px' }}>
        <div style={{ width:46, flexShrink:0, textAlign:'center' }}>
          <p style={{ fontSize:'0.62rem', fontWeight:700, color:gold, textTransform:'uppercase', letterSpacing:'0.06em' }}>{workout.day.slice(0,3)}</p>
          {workout.time && <p style={{ fontSize:'0.60rem', color:dim, marginTop:1 }}>{workout.time}</p>}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:'0.83rem', color:cream, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{workout.exercise||'Workout'}</p>
          {workout.notes && <p style={{ fontSize:'0.68rem', color:dim, marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{workout.notes}</p>}
        </div>
        <DeleteBtn onClick={()=>onDelete(workout.id)} />
      </div>
      <Divider />
    </>
  )
}

function AddWorkoutForm({ onAdd, onCancel }) {
  const [day,setDay]=useState('Monday')
  const [time,setTime]=useState('')
  const [exercise,setExercise]=useState('')
  const [notes,setNotes]=useState('')
  const submit=()=>{ if(!exercise.trim()) return; onAdd({id:uid(),day,time:time.trim(),exercise:exercise.trim(),notes:notes.trim()}); setDay('Monday');setTime('');setExercise('');setNotes('') }
  return (
    <AddFormWrap>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        <Select label="Day" value={day} onChange={setDay} options={DAYS} />
        <Input label="Time" value={time} onChange={setTime} placeholder="e.g. 6:30 AM" />
      </div>
      <Input label="Exercise *" value={exercise} onChange={setExercise} placeholder="e.g. Upper body push" />
      <Input label="Notes" value={notes} onChange={setNotes} placeholder="Sets, reps, focus area..." />
      <div style={{ display:'flex', gap:8 }}><Btn onClick={submit} variant="primary" disabled={!exercise.trim()}>Add Workout</Btn><Btn onClick={onCancel} variant="ghost">Cancel</Btn></div>
    </AddFormWrap>
  )
}

function TokenSection({ token, onSave }) {
  const [open,setOpen]=useState(!token)
  const [val,setVal]=useState('')
  const save=()=>{ onSave(val.trim()); setOpen(false); setVal('') }
  return (
    <Card>
      <div onClick={()=>setOpen(o=>!o)} style={{ padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', userSelect:'none' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:'0.7rem' }}>🔑</span>
          <p style={{ fontSize:'0.72rem', color:token?'#4ade80':'#f87171', fontWeight:600 }}>{token?'GitHub connected — tap to update token':'GitHub token needed to push changes'}</p>
        </div>
        <span style={{ fontSize:'0.65rem', color:dim }}>{open?'▲':'▼'}</span>
      </div>
      {open && (
        <div style={{ padding:'0 16px 14px', borderTop:`1px solid ${bdr}`, paddingTop:12, display:'flex', flexDirection:'column', gap:10 }}>
          <Input type="password" label="Personal Access Token" value={val} onChange={setVal} placeholder="ghp_xxxxxxxxxxxxxxxx" hint="github.com → Settings → Developer settings → Personal access tokens (classic) → New token. Enable the repo scope." />
          <div style={{ display:'flex', gap:8 }}><Btn onClick={save} variant="primary" disabled={!val.trim()}>Save Token</Btn>{token && <Btn onClick={()=>setOpen(false)} variant="ghost">Cancel</Btn>}</div>
        </div>
      )}
    </Card>
  )
}

function PushButton({ photos, workouts, token }) {
  const [st,setSt]=useState('idle')
  const [err,setErr]=useState('')
  const push=async()=>{
    if(!token){setSt('err');setErr('Enter your GitHub token above first.');return}
    setSt('saving')
    try{ await saveToDashboard({photos:photos.length?photos:null,workouts},token); setSt('ok'); setTimeout(()=>setSt('idle'),9000) }
    catch(e){ setSt('err'); setErr(e.message) }
  }
  return (
    <div style={{ margin:'0 14px', display:'flex', flexDirection:'column', gap:8 }}>
      <button onClick={push} disabled={st==='saving'} style={{ width:'100%', padding:15, borderRadius:12, border:`1px solid rgba(200,169,110,${st==='ok'?'0.55':'0.38'})`, background:st==='ok'?'rgba(74,222,128,0.10)':'rgba(200,169,110,0.13)', color:st==='ok'?'#4ade80':'#e2c896', fontSize:'0.95rem', fontWeight:700, letterSpacing:'0.04em', cursor:st==='saving'?'not-allowed':'pointer', minHeight:52, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
        {st==='saving'?'Pushing to GitHub...':st==='ok'?'Pushed! Dashboard updates in ~2 min':'Push to Dashboard'}
      </button>
      {st==='err' && <p style={{ fontSize:'0.70rem', color:'#f87171', textAlign:'center' }}>Error: {err}</p>}
      {!token && st!=='err' && <p style={{ fontSize:'0.63rem', color:dimmer, textAlign:'center' }}>Set up your GitHub token above to push to the big screen.</p>}
    </div>
  )
}

export function MobileView() {
  const [photos,  setPhotos]  = useState(()=>readJson(DRAFT_PHOTOS_KEY,  []))
  const [workouts,setWorkouts]= useState(()=>readJson(DRAFT_WORKOUTS_KEY,[]))
  const [token,   setToken]   = useState(()=>localStorage.getItem(TOKEN_KEY)||'')
  const [addPhoto,   setAddPhoto]   = useState(false)
  const [addWorkout, setAddWorkout] = useState(false)

  useEffect(()=>writeJson(DRAFT_PHOTOS_KEY,  photos),  [photos])
  useEffect(()=>writeJson(DRAFT_WORKOUTS_KEY,workouts),[workouts])

  const saveToken=t=>{ setToken(t); t?localStorage.setItem(TOKEN_KEY,t):localStorage.removeItem(TOKEN_KEY) }

  return (
    <div style={{ position:'relative', zIndex:3, height:'100%', overflowY:'auto', overflowX:'hidden', WebkitOverflowScrolling:'touch', cursor:'auto' }}>
      <div style={{ padding:'18px 20px 14px', background:'rgba(10,5,1,0.75)', borderBottom:`1px solid ${bdr}`, backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)', position:'sticky', top:0, zIndex:10 }}>
        <h1 style={{ fontSize:'1.45rem', fontWeight:800, color:cream, letterSpacing:'-0.02em', lineHeight:1.1 }}>Dashboard Editor</h1>
        <p style={{ fontSize:'0.70rem', color:dim, marginTop:2 }}>{settings.ownerName}&rsquo;s Home &middot; Changes push to the big screen</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:14, padding:'16px 0 36px' }}>
        <TokenSection token={token} onSave={saveToken} />

        <Card>
          <SectionHead emoji="📸" label="Slideshow Photos" count={photos.length} />
          {photos.length===0 && !addPhoto && <p style={{ padding:'18px 16px', fontSize:'0.78rem', color:dimmer, textAlign:'center' }}>No photos yet — tap below to add your first</p>}
          {photos.map(p=><PhotoRow key={p.id} photo={p} onDelete={id=>setPhotos(prev=>prev.filter(x=>x.id!==id))} />)}
          {addPhoto
            ? <AddPhotoForm token={token} onAdd={p=>{setPhotos(prev=>[...prev,p]);setAddPhoto(false)}} onCancel={()=>setAddPhoto(false)} />
            : <div style={{ padding:'10px 16px' }}><Btn onClick={()=>setAddPhoto(true)}>+ Add Photo</Btn></div>}
        </Card>

        <Card>
          <SectionHead emoji="💪" label="Workout Schedule" count={workouts.length} />
          {workouts.length===0 && !addWorkout && <p style={{ padding:'18px 16px', fontSize:'0.78rem', color:dimmer, textAlign:'center' }}>No workouts yet — build your weekly schedule below</p>}
          {workouts.map(w=><WorkoutRow key={w.id} workout={w} onDelete={id=>setWorkouts(prev=>prev.filter(x=>x.id!==id))} />)}
          {addWorkout
            ? <AddWorkoutForm onAdd={w=>{setWorkouts(prev=>[...prev,w]);setAddWorkout(false)}} onCancel={()=>setAddWorkout(false)} />
            : <div style={{ padding:'10px 16px' }}><Btn onClick={()=>setAddWorkout(true)}>+ Add Workout</Btn></div>}
        </Card>

        <PushButton photos={photos} workouts={workouts} token={token} />
      </div>
    </div>
  )
}
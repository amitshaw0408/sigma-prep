import { useRef, useState } from 'react'
import Modal from './Modal'

const lines = (v) => v.split('\n').map((s) => s.trim()).filter(Boolean)
const csv = (v) => v.split(',').map((s) => s.trim()).filter(Boolean)
const EMPTY = { title: '', cat: '', level: '', topics: '', desc: '', learn: '', prereq: '', modules: '', skills: '', format: '', price: '' }
const FIELDS = [['title', 'Title *'], ['cat', 'Category (folder) *'], ['level', 'Level'], ['topics', 'Topics (comma separated)'], ['desc', 'Description *', 1],
  ['learn', 'What students will learn (one per line)', 1], ['prereq', 'Prerequisites'], ['modules', 'Modules (one per line)', 1],
  ['skills', 'Skills (comma separated)'], ['format', 'Format (optional)'], ['price', 'Price (optional)']]

const Field = ({ label, area, ...p }) => <label>{label}{area ? <textarea rows={3} {...p} /> : <input {...p} />}</label>

// Delete needs two clicks ("Sure?") to avoid accidents.
function Del({ onGo, disabled, label = 'Delete' }) {
  const [sure, setSure] = useState(false)
  return <button type="button" className="btn sec" disabled={disabled} onClick={() => { if (sure) { setSure(false); onGo() } else setSure(true) }}>{sure ? 'Sure?' : label}</button>
}

function Login({ st }) {
  const [id, setId] = useState(''), [pw, setPw] = useState(''), [show, setShow] = useState(false), [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  const go = async (e) => {
    e.preventDefault(); setBusy(true); setErr('')
    try { await st.login(id, pw) } catch (x) { setErr(x.message) } finally { setBusy(false) }
  }
  return (
    <>
      <h2 id="mt">Admin login</h2>
      <form className="fm" onSubmit={go}>
        <label>Security ID<input autoFocus value={id} onChange={(e) => setId(e.target.value)} autoComplete="username" autoCapitalize="off" autoCorrect="off" spellCheck="false" required /></label>
        <label>Password<span className="pw">
          <input type={show ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" required />
          <button type="button" className="eye" aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} onClick={() => setShow((s) => !s)}>{show ? 'Hide' : 'Show'}</button>
        </span></label>
        <p role="alert" style={{ color: '#b3261e' }}>{err}</p>
        <button className="btn pri" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </>
  )
}

function Panel({ st, onClose }) {
  const { courses, reviews } = st
  const cats = st.folders
  const [cf, setCf] = useState(EMPTY), [editC, setEditC] = useState(null)
  const [rf, setRf] = useState({ name: '', text: '', course: '' }), [editR, setEditR] = useState('')
  const [msg, setMsg] = useState(''), [busy, setBusy] = useState(false)
  const [fname, setFname] = useState(''), [editF, setEditF] = useState('')
  const fileC = useRef(), fileF = useRef()

  // Runs an API action with a busy flag and a status message (errors from the server are shown as-is).
  const run = async (fn, ok) => {
    setBusy(true); setMsg('')
    try { await fn(); setMsg(ok) } catch (e) { setMsg(e.message) } finally { setBusy(false) }
  }
  const subCourse = (e) => {
    e.preventDefault()
    if (!cf.title.trim() || !cf.cat.trim() || !cf.desc.trim()) return setMsg('Title, category and description are required.')
    run(async () => {
      await st.saveCourse({ id: editC?.id, title: cf.title, cat: cf.cat, level: cf.level, topics: csv(cf.topics), desc: cf.desc, learn: lines(cf.learn),
        prereq: cf.prereq, modules: lines(cf.modules), skills: csv(cf.skills), format: cf.format, price: cf.price }, fileC.current.files[0])
      setCf(EMPTY); setEditC(null); fileC.current.value = ''
    }, 'Course saved.')
  }
  const editCourse = (c) => {
    setEditC(c)
    setCf({ title: c.title, cat: c.cat, level: c.level || '', topics: (c.topics || []).join(', '), desc: c.desc || '', learn: (c.learn || []).join('\n'),
      prereq: c.prereq || '', modules: (c.modules || []).join('\n'), skills: (c.skills || []).join(', '), format: c.format || '', price: c.price || '' })
    document.getElementById('cfh')?.scrollIntoView({ behavior: 'smooth' })
  }
  const subReview = (e) => {
    e.preventDefault()
    if (!rf.name.trim() || !rf.text.trim()) return setMsg('Name and review text are required.')
    run(async () => { await st.saveReview({ id: editR || undefined, ...rf }); setRf({ name: '', text: '', course: '' }); setEditR('') }, 'Review saved.')
  }
  const editReview = (r) => { setEditR(r.id); setRf({ name: r.name, text: r.text, course: r.course || '' }); document.getElementById('rfh')?.scrollIntoView({ behavior: 'smooth' }) }
  // Add a folder, or (when editing) rename it and/or replace its cover image.
  const subFolder = (e) => {
    e.preventDefault()
    const name = fname.trim(), file = fileF.current.files[0]
    if (!name) return setMsg('Type a folder name.')
    if (!editF && cats.includes(name)) return setMsg('A folder with this name already exists.')
    run(async () => {
      if (editF && name !== editF) await st.renameFolder(editF, name)
      else if (!editF) await st.addFolder(name)
      if (file) await st.setFolderImg(name, file)
      setFname(''); setEditF(''); fileF.current.value = ''
    }, editF ? 'Folder updated.' : 'Folder added.')
  }
  const editFolder = (c) => { setEditF(c); setFname(c); fileF.current.value = ''; document.getElementById('ffh')?.scrollIntoView({ behavior: 'smooth' }) }
  const cancelFolder = () => { setEditF(''); setFname(''); fileF.current.value = '' }

  return (
    <>
      <h2 id="mt">Admin panel</h2>
      <p>Everything you save here goes straight to your database and appears on the website immediately.</p>
      <p role="status" style={{ position: 'sticky', top: 0, background: 'var(--card)', padding: '6px 0', fontWeight: 600 }}>{busy ? 'Saving…' : msg}</p>

      <h4 id="cfh">{editC ? 'Edit course: ' + editC.title : 'Add course'}</h4>
      <form className="fm" onSubmit={subCourse}>
        {FIELDS.map(([k, l, a]) => <Field key={k} label={l} area={a} list={k === 'cat' ? 'folderlist' : undefined} value={cf[k]} onChange={(e) => setCf({ ...cf, [k]: e.target.value })} />)}
        <datalist id="folderlist">{cats.map((c) => <option key={c} value={c} />)}</datalist>
        <label>Course image (optional, max 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" ref={fileC} /></label>
        <div className="row"><button className="btn pri" type="submit" disabled={busy}>Save course</button>
          {editC && <button type="button" className="btn sec" onClick={() => { setEditC(null); setCf(EMPTY) }}>Cancel edit</button>}</div>
      </form>

      <h4 id="ffh">{editF ? 'Edit folder: ' + editF : 'Add folder'}</h4>
      <form className="fm" onSubmit={subFolder}>
        <label>Folder name *<input value={fname} onChange={(e) => setFname(e.target.value)} placeholder="e.g. Python" /></label>
        <label>Cover image (optional, max 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" ref={fileF} /></label>
        <div className="row">
          <button className="btn pri" type="submit" disabled={busy}>{editF ? 'Save folder' : 'Add folder'}</button>
          {editF && st.fimg[editF] && <button type="button" className="btn sec" disabled={busy} onClick={() => run(() => st.removeFolderImg(editF), 'Cover image removed.')}>Remove cover image</button>}
          {editF && <button type="button" className="btn sec" onClick={cancelFolder}>Cancel edit</button>}
        </div>
      </form>

      <h4>All folders</h4>
      {cats.map((c) => {
        const n = courses.filter((x) => x.cat === c).length
        return (
          <div className="ai" key={c}><span>{c} ({n} course{n === 1 ? '' : 's'})</span>
            <span><button type="button" className="btn sec" onClick={() => editFolder(c)}>Edit</button>{' '}
              <Del disabled={busy} onGo={() => run(async () => { await st.deleteFolder(c); if (editF === c) cancelFolder() }, 'Folder deleted.')} /></span></div>
        )
      })}
      {!cats.length && <p>No folders yet.</p>}
      <p style={{ fontSize: 13 }}>A folder can only be deleted when it has no courses. To move a course to another folder, edit the course and change its category.</p>

      <h4>All courses</h4>
      {courses.map((c) => (
        <div className="ai" key={c.id}><span>{c.title}</span>
          <span><button type="button" className="btn sec" onClick={() => editCourse(c)}>Edit</button> <Del disabled={busy} onGo={() => run(() => st.delCourse(c.id), 'Course deleted.')} /></span></div>
      ))}
      {!courses.length && <p>No courses yet.</p>}

      <h4 id="rfh">{editR ? 'Edit review' : 'Add customer review'}</h4>
      <form className="fm" onSubmit={subReview}>
        <Field label="Student name *" value={rf.name} onChange={(e) => setRf({ ...rf, name: e.target.value })} />
        <Field label="Review *" area value={rf.text} onChange={(e) => setRf({ ...rf, text: e.target.value })} />
        <Field label="Course (optional)" value={rf.course} onChange={(e) => setRf({ ...rf, course: e.target.value })} />
        <div className="row"><button className="btn pri" type="submit" disabled={busy}>Save review</button>
          {editR && <button type="button" className="btn sec" onClick={() => { setEditR(''); setRf({ name: '', text: '', course: '' }) }}>Cancel edit</button>}</div>
      </form>

      <h4>All reviews</h4>
      {reviews.map((r) => (
        <div className="ai" key={r.id}><span>Review: {r.name}{r.sample ? ' (sample)' : ''}</span>
          <span><button type="button" className="btn sec" onClick={() => editReview(r)}>Edit</button> <Del disabled={busy} onGo={() => run(() => st.delReview(r.id), 'Review deleted.')} /></span></div>
      ))}
      {!reviews.length && <p>No reviews yet.</p>}

      <div className="row" style={{ marginTop: 18 }}>
        <button type="button" className="btn sec" onClick={() => { st.logout(); onClose() }}>Log out</button>
      </div>
    </>
  )
}

export default function Admin({ st, onClose }) {
  return <Modal onClose={onClose}>{st.authed ? <Panel st={st} onClose={onClose} /> : <Login st={st} />}</Modal>
}

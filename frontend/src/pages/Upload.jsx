import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../utils/api'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({ caption: '', tags: '' })
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setError('')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return setError('Please select a file first')
    setUploading(true)
    setError('')
    setProgress(30)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setProgress(80)
      const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean)
      await api.post('/posts', {
        media_url: uploadRes.data.url,
        media_type: uploadRes.data.media_type,
        caption: form.caption,
        tags: tagsArray
      })
      setProgress(100)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const mediaType = file?.type?.startsWith('video/') ? 'video'
    : file?.type?.startsWith('audio/') ? 'audio' : 'image'

  return (
    <div style={s.page}>
      <Navbar />
      <main style={s.main}>
        <div style={s.header}>
          <h1 style={s.title}>Share AI Content</h1>
          <p style={s.subtitle}>Upload your AI-generated creations</p>
        </div>

        <div style={s.card}>
          {error && (
            <div style={s.errorBox}>
              <svg width="16" height="16" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {uploading && (
            <div style={s.progressWrap}>
              <div style={s.progressBar}>
                <div style={{ ...s.progressFill, width: `${progress}%` }} />
              </div>
              <p style={s.progressText}>Uploading to Cloudinary... {progress}%</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={s.form}>
            {/* Dropzone */}
            <label
              htmlFor="fileInput"
              style={s.dropzone}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
            >
              {preview ? (
                <div style={s.previewWrap}>
                  {mediaType === 'video' ? (
                    <video src={preview} style={s.previewMedia} controls />
                  ) : mediaType === 'audio' ? (
                    <div style={s.audioPreview}>
                      <svg width="48" height="48" fill="none" stroke="#7c3aed" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                      </svg>
                      <audio src={preview} controls style={{ width: '100%', marginTop: '16px' }} />
                    </div>
                  ) : (
                    <img src={preview} alt="preview" style={s.previewMedia} />
                  )}
                  <div style={s.changeFileBtn}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Change file
                  </div>
                </div>
              ) : (
                <div style={s.dropContent}>
                  <div style={s.dropIcon}>
                    <svg width="32" height="32" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <p style={s.dropTitle}>Drop your file here</p>
                  <p style={s.dropSub}>or <span style={s.browseLink}>browse to upload</span></p>
                  <p style={s.dropFormats}>Images, videos, audio — max 100MB</p>
                </div>
              )}
            </label>
            <input id="fileInput" type="file" accept="image/*,video/*,audio/*" onChange={handleFile} style={{ display: 'none' }} />

            {/* Caption */}
            <div style={s.field}>
              <label style={s.label}>Caption</label>
              <textarea
                style={s.textarea}
                placeholder="Describe your AI creation..."
                value={form.caption}
                onChange={e => setForm({ ...form, caption: e.target.value })}
                rows={3}
              />
            </div>

            {/* Tags */}
            <div style={s.field}>
              <label style={s.label}>Tags <span style={s.labelNote}>(comma separated)</span></label>
              <input
                style={s.input}
                type="text"
                placeholder="ai-art, cinematic, surreal, anime"
                value={form.tags}
                onChange={e => setForm({ ...form, tags: e.target.value })}
              />
            </div>

            <button
              style={{ ...s.submitBtn, opacity: uploading ? 0.7 : 1 }}
              type="submit"
              disabled={uploading || !file}
            >
              {uploading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  <span style={s.spinner} />
                  Uploading...
                </span>
              ) : 'Post to AI·gram'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

const s = {
  page: { background: 'var(--color-bg)', minHeight: '100dvh' },
  main: { maxWidth: '560px', margin: '0 auto', padding: '28px 16px' },
  header: { marginBottom: '20px' },
  title: { fontSize: '22px', fontWeight: '700', color: 'var(--color-text)', margin: '0 0 4px' },
  subtitle: { fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 },
  card: {
    background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
    padding: '28px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)',
  },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: '#fef2f2', border: '1px solid #fecaca',
    borderRadius: 'var(--radius-sm)', padding: '10px 14px',
    color: 'var(--color-error)', fontSize: '13px', marginBottom: '16px',
  },
  progressWrap: { marginBottom: '16px' },
  progressBar: { height: '4px', background: 'var(--color-border)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' },
  progressFill: { height: '100%', background: 'var(--color-primary)', borderRadius: '2px', transition: 'width 0.3s ease' },
  progressText: { fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  dropzone: {
    display: 'block', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)',
    cursor: 'pointer', overflow: 'hidden', transition: 'border-color 0.15s',
    minHeight: '200px',
  },
  dropContent: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '48px 24px', textAlign: 'center',
  },
  dropIcon: {
    width: '64px', height: '64px', borderRadius: 'var(--radius-md)',
    background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '16px',
  },
  dropTitle: { fontSize: '15px', fontWeight: '600', color: 'var(--color-text)', margin: '0 0 6px' },
  dropSub: { fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 8px' },
  browseLink: { color: 'var(--color-primary)', fontWeight: '600' },
  dropFormats: { fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 },
  previewWrap: { position: 'relative' },
  previewMedia: { width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' },
  audioPreview: {
    padding: '32px 24px', background: 'var(--color-primary-light)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  changeFileBtn: {
    position: 'absolute', bottom: '12px', right: '12px',
    background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '6px 12px',
    borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '500',
    display: 'flex', alignItems: 'center', gap: '4px', backdropFilter: 'blur(4px)',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '500', color: 'var(--color-text)' },
  labelNote: { color: 'var(--color-text-muted)', fontWeight: '400' },
  input: {
    padding: '11px 14px', borderRadius: 'var(--radius-sm)',
    border: '1.5px solid var(--color-border)', background: '#fff',
    fontSize: '14px', color: 'var(--color-text)', outline: 'none',
  },
  textarea: {
    padding: '11px 14px', borderRadius: 'var(--radius-sm)',
    border: '1.5px solid var(--color-border)', background: '#fff',
    fontSize: '14px', color: 'var(--color-text)', outline: 'none',
    resize: 'vertical', lineHeight: '1.5',
  },
  submitBtn: {
    padding: '13px', borderRadius: 'var(--radius-sm)',
    background: 'var(--color-primary)', border: 'none',
    color: '#fff', fontSize: '15px', fontWeight: '600',
    cursor: 'pointer', boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
    transition: 'all 0.15s ease',
  },
  spinner: {
    display: 'inline-block', width: '16px', height: '16px',
    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
    borderRadius: '50%', animation: 'spin 0.7s linear infinite',
  },
}

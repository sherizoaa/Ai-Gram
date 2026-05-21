import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../utils/api'

export default function Upload() {
  const [form, setForm] = useState({ media_url: '', media_type: 'image', caption: '', tags: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean)
      await api.post('/posts', { ...form, tags: tagsArray })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed')
    }
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Upload AI Content</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Media URL (paste Cloudinary or direct link)</label>
          <input
            style={styles.input}
            type="text"
            placeholder="https://..."
            value={form.media_url}
            onChange={e => setForm({ ...form, media_url: e.target.value })}
            required
          />

          <label style={styles.label}>Type</label>
          <select
            style={styles.input}
            value={form.media_type}
            onChange={e => setForm({ ...form, media_type: e.target.value })}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>

          <label style={styles.label}>Caption</label>
          <textarea
            style={{ ...styles.input, height: '80px', resize: 'vertical' }}
            placeholder="Describe your AI creation..."
            value={form.caption}
            onChange={e => setForm({ ...form, caption: e.target.value })}
          />

          <label style={styles.label}>Tags (comma separated)</label>
          <input
            style={styles.input}
            type="text"
            placeholder="ai-art, cinematic, surreal"
            value={form.tags}
            onChange={e => setForm({ ...form, tags: e.target.value })}
          />

          <button style={styles.button} type="submit">Post to AI-Gram</button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  page: { background: '#0a0a0f', minHeight: '100vh' },
  container: { maxWidth: '560px', margin: '0 auto', padding: '32px 16px' },
  title: { color: '#a78bfa', marginBottom: '24px', fontSize: '22px' },
  label: { display: 'block', color: '#888', fontSize: '13px', marginBottom: '6px' },
  input: { width: '100%', padding: '12px', marginBottom: '16px', background: '#13131a', border: '1px solid #2a2a3a', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '13px', background: '#7c3aed', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '15px', cursor: 'pointer', fontWeight: 'bold' },
  error: { color: '#f87171', fontSize: '13px', marginBottom: '12px' }
}

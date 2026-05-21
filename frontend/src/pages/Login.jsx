import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Logo */}
        <div style={s.logoWrap}>
          <div style={s.logoIcon}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path fill="#7c3aed" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
          </div>
          <h1 style={s.logo}>AI<span style={s.logoAccent}>•</span>gram</h1>
          <p style={s.tagline}>The world of AI-generated creativity</p>
        </div>

        {error && (
          <div style={s.errorBox}>
            <svg width="16" height="16" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              style={s.input}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              style={s.input}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div style={s.divider}><span style={s.dividerText}>or</span></div>

        <p style={s.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={s.link}>Create one</Link>
        </p>
      </div>

      {/* Side decoration */}
      <div style={s.decoration} aria-hidden="true">
        <div style={s.blob1} />
        <div style={s.blob2} />
      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100dvh', background: 'var(--color-bg)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '24px', position: 'relative', overflow: 'hidden',
  },
  card: {
    background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
    padding: '40px', width: '100%', maxWidth: '400px',
    boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)',
    position: 'relative', zIndex: 1,
  },
  logoWrap: { textAlign: 'center', marginBottom: '28px' },
  logoIcon: {
    width: '56px', height: '56px', borderRadius: '16px',
    background: 'var(--color-primary-light)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 14px',
  },
  logo: { fontSize: '26px', fontWeight: '700', letterSpacing: '-0.5px', margin: '0 0 6px' },
  logoAccent: { color: 'var(--color-primary)' },
  tagline: { color: 'var(--color-text-secondary)', fontSize: '13px', margin: 0 },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: '#fef2f2', border: '1px solid #fecaca',
    borderRadius: 'var(--radius-sm)', padding: '10px 14px',
    color: 'var(--color-error)', fontSize: '13px', marginBottom: '16px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '500', color: 'var(--color-text)' },
  input: {
    padding: '11px 14px', borderRadius: 'var(--radius-sm)',
    border: '1.5px solid var(--color-border)', background: '#fff',
    fontSize: '14px', color: 'var(--color-text)',
    outline: 'none', transition: 'border-color 0.15s',
  },
  btn: {
    padding: '12px', borderRadius: 'var(--radius-sm)',
    background: 'var(--color-primary)', border: 'none',
    color: '#fff', fontSize: '15px', fontWeight: '600',
    cursor: 'pointer', transition: 'all 0.15s ease',
    boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
    marginTop: '4px',
  },
  divider: {
    position: 'relative', textAlign: 'center', margin: '20px 0',
    borderTop: '1px solid var(--color-border)',
  },
  dividerText: {
    position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
    background: '#fff', padding: '0 10px',
    color: 'var(--color-text-muted)', fontSize: '12px',
  },
  footer: { textAlign: 'center', fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 },
  link: { color: 'var(--color-primary)', fontWeight: '600' },
  blob1: {
    position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent)',
    top: '-80px', right: '-80px', pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute', width: '200px', height: '200px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168,85,247,0.10), transparent)',
    bottom: '-60px', left: '-60px', pointerEvents: 'none',
  },
  decoration: { position: 'absolute', inset: 0, pointerEvents: 'none' },
}

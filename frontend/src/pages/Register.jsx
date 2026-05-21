import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/register', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.logo}>AI-GRAM</h1>
        <p style={styles.sub}>Join the AI creator community</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <button style={styles.button} type="submit">Create Account</button>
        </form>
        <p style={styles.link}>Have account? <Link to="/login" style={{ color: '#a78bfa' }}>Login</Link></p>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  box: { background: '#13131a', padding: '40px', borderRadius: '16px', width: '360px', border: '1px solid #2a2a3a' },
  logo: { color: '#a78bfa', fontSize: '32px', margin: '0 0 8px', textAlign: 'center', letterSpacing: '4px' },
  sub: { color: '#666', fontSize: '13px', textAlign: 'center', marginBottom: '24px' },
  input: { width: '100%', padding: '12px', marginBottom: '12px', background: '#1e1e2e', border: '1px solid #2a2a3a', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', background: '#7c3aed', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '15px', cursor: 'pointer', fontWeight: 'bold' },
  error: { color: '#f87171', fontSize: '13px', marginBottom: '12px', textAlign: 'center' },
  link: { color: '#666', fontSize: '13px', textAlign: 'center', marginTop: '16px' }
}

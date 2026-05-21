import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>AI-GRAM</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Feed</Link>
        <Link to="/upload" style={styles.link}>+ Upload</Link>
        <Link to={`/profile/${user.id}`} style={styles.link}>@{user.username}</Link>
        <button onClick={logout} style={styles.logout}>Logout</button>
      </div>
    </nav>
  )
}

const styles = {
  nav: { background: '#0d0d14', borderBottom: '1px solid #2a2a3a', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 },
  logo: { color: '#a78bfa', fontWeight: '900', fontSize: '20px', textDecoration: 'none', letterSpacing: '3px' },
  links: { display: 'flex', alignItems: 'center', gap: '20px' },
  link: { color: '#ccc', textDecoration: 'none', fontSize: '14px' },
  logout: { background: 'none', border: '1px solid #2a2a3a', color: '#888', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }
}

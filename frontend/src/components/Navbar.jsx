import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        {/* Logo */}
        <Link to="/" style={s.logo}>
          <span style={s.logoText}>AI</span>
          <span style={s.logoDot}>•</span>
          <span style={s.logoText}>gram</span>
        </Link>

        {/* Center nav links */}
        <div style={s.links}>
          <Link to="/" style={{ ...s.link, ...(isActive('/') ? s.linkActive : {}) }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            <span style={s.linkLabel}>Feed</span>
          </Link>
          <Link to="/upload" style={{ ...s.link, ...(isActive('/upload') ? s.linkActive : {}) }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span style={s.linkLabel}>Upload</span>
          </Link>
        </div>

        {/* Right: avatar + logout */}
        <div style={s.right}>
          <Link to={`/profile/${user.id}`} style={s.avatar} title={`@${user.username}`}>
            {user.username?.[0]?.toUpperCase() || '?'}
          </Link>
          <button onClick={logout} style={s.logoutBtn} title="Logout">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}

const s = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--color-border)',
    height: 'var(--nav-height)',
  },
  inner: {
    maxWidth: '960px', margin: '0 auto',
    padding: '0 20px', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '2px',
    fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px',
  },
  logoText: { color: 'var(--color-text)' },
  logoDot: { color: 'var(--color-primary)', fontSize: '24px', lineHeight: 1 },
  links: { display: 'flex', alignItems: 'center', gap: '4px' },
  link: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 14px', borderRadius: 'var(--radius-full)',
    color: 'var(--color-text-secondary)', fontSize: '14px', fontWeight: '500',
    transition: 'all 0.15s ease', cursor: 'pointer',
  },
  linkActive: {
    background: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
  },
  linkLabel: { fontSize: '14px' },
  right: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: '#fff', fontSize: '14px', fontWeight: '600',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
  },
  logoutBtn: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: 'transparent', border: '1px solid var(--color-border)',
    color: 'var(--color-text-secondary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s ease',
  },
}

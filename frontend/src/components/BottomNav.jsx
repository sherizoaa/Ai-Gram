import { Link, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const at = (path) => location.pathname === path
  const onProfile = location.pathname.startsWith('/profile')

  return (
    <nav style={s.nav}>
      <Link to="/" style={{ ...s.item, ...(at('/') ? s.active : {}) }}>
        <svg width="24" height="24" fill={at('/') ? '#111827' : 'none'} stroke={at('/') ? '#111827' : '#6b7280'} strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span style={{ ...s.label, ...(at('/') ? s.labelActive : {}) }}>Home</span>
      </Link>

      <Link to="/explore" style={{ ...s.item, ...(at('/explore') ? s.active : {}) }}>
        <svg width="24" height="24" fill="none" stroke={at('/explore') ? '#111827' : '#6b7280'} strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <span style={{ ...s.label, ...(at('/explore') ? s.labelActive : {}) }}>Explore</span>
      </Link>

      <Link to="/upload" style={s.uploadBtn}>
        <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </Link>

      <Link to="/activity" style={{ ...s.item, ...(at('/activity') ? s.active : {}) }}>
        <svg width="24" height="24" fill="none" stroke={at('/activity') ? '#111827' : '#6b7280'} strokeWidth="2" viewBox="0 0 24 24">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        <span style={{ ...s.label, ...(at('/activity') ? s.labelActive : {}) }}>Activity</span>
      </Link>

      <Link to={user.id ? `/profile/${user.id}` : '/login'} style={{ ...s.item, ...(onProfile ? s.active : {}) }}>
        <svg width="24" height="24" fill="none" stroke={onProfile ? '#111827' : '#6b7280'} strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span style={{ ...s.label, ...(onProfile ? s.labelActive : {}) }}>Profile</span>
      </Link>
    </nav>
  )
}

const s = {
  nav: {
    position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
    background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)',
    borderTop: '1px solid #f0f0f5',
    display: 'flex', alignItems: 'center', justifyContent: 'space-around',
    height: '64px', paddingBottom: 'env(safe-area-inset-bottom)',
  },
  item: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '3px', textDecoration: 'none', padding: '6px 16px',
    borderRadius: '12px', transition: 'background 0.15s',
  },
  active: {},
  label: { fontSize: '11px', fontWeight: '500', color: '#6b7280' },
  labelActive: { color: '#111827', fontWeight: '600' },
  uploadBtn: {
    width: '52px', height: '52px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    textDecoration: 'none',
    boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
    flexShrink: 0,
  },
}

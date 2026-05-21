import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header style={s.nav}>
      <Link to="/" style={s.brand}>
        <div style={s.logoMark}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M15 2L22 9L28 15L22 21L15 28L8 21L2 15L8 9L15 2Z" fill="url(#g1)"/>
            <path d="M15 7L20 12L23 15L20 18L15 23L10 18L7 15L10 12L15 7Z" fill="white" opacity="0.35"/>
            <defs>
              <linearGradient id="g1" x1="2" y1="2" x2="28" y2="28">
                <stop offset="0%" stopColor="#7c3aed"/>
                <stop offset="100%" stopColor="#c084fc"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span style={s.brandText}>AI-Gram</span>
      </Link>

      <div style={s.right}>
        <button style={s.iconBtn} aria-label="Notifications">
          <svg width="22" height="22" fill="none" stroke="#111827" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span style={s.badge} />
        </button>
        <button style={s.iconBtn} aria-label="Messages">
          <svg width="22" height="22" fill="none" stroke="#111827" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </header>
  )
}

const s = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #f0f0f5',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 16px', height: '56px',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: '8px',
    textDecoration: 'none',
  },
  logoMark: { display: 'flex', alignItems: 'center' },
  brandText: {
    fontSize: '20px', fontWeight: '800', color: '#111827',
    letterSpacing: '-0.3px',
  },
  right: { display: 'flex', alignItems: 'center', gap: '4px' },
  iconBtn: {
    position: 'relative', width: '40px', height: '40px',
    borderRadius: '50%', border: 'none', background: 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
  badge: {
    position: 'absolute', top: '8px', right: '8px',
    width: '8px', height: '8px', borderRadius: '50%',
    background: '#7c3aed', border: '1.5px solid #fff',
  },
}

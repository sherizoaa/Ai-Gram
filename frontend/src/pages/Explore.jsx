import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import api from '../utils/api'

export default function Explore() {
  const [posts, setPosts] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/posts')
      .then(res => setPosts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = query
    ? posts.filter(p =>
        p.caption?.toLowerCase().includes(query.toLowerCase()) ||
        p.username?.toLowerCase().includes(query.toLowerCase()) ||
        p.tags?.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    : posts

  return (
    <div style={s.page}>
      <Navbar />
      <main style={s.main}>

        {/* Search bar */}
        <div style={s.searchWrap}>
          <svg width="18" height="18" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24" style={s.searchIcon}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            style={s.searchInput}
            type="text"
            placeholder="Search posts, creators, tags..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button style={s.clearBtn} onClick={() => setQuery('')}>
              <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={s.grid}>
            {[1,2,3,4,5,6].map(i => <div key={i} style={s.skelItem} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div style={s.grid}>
            {filtered.map((post, i) => (
              <Link key={post.id} to={`/profile/${post.user_id}`} style={{
                ...s.gridItem,
                ...(i % 7 === 0 ? s.gridItemWide : {}),
              }}>
                {post.media_type === 'video' ? (
                  <>
                    <video src={post.media_url} style={s.gridMedia} />
                    <div style={s.playOverlay}>
                      <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                    </div>
                  </>
                ) : post.media_type === 'audio' ? (
                  <div style={s.audioItem}>
                    <svg width="28" height="28" fill="none" stroke="#7c3aed" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                    </svg>
                  </div>
                ) : (
                  <img src={post.media_url} alt={post.caption} style={s.gridMedia} loading="lazy" />
                )}
                <div style={s.gridOverlay}>
                  <span style={s.gridUser}>@{post.username}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={s.empty}>
            <svg width="40" height="40" fill="none" stroke="#d1d5db" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p style={s.emptyText}>No results for "{query}"</p>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}

const s = {
  page: { background: '#f5f5f8', minHeight: '100dvh', paddingBottom: '80px' },
  main: { maxWidth: '600px', margin: '0 auto', padding: '12px 16px' },

  searchWrap: {
    position: 'relative', marginBottom: '16px',
    display: 'flex', alignItems: 'center',
  },
  searchIcon: { position: 'absolute', left: '14px', flexShrink: 0 },
  searchInput: {
    width: '100%', padding: '12px 40px 12px 44px',
    borderRadius: '14px', border: '1.5px solid #e5e7eb',
    background: '#fff', fontSize: '14px', color: '#111827',
    outline: 'none', fontFamily: 'var(--font)',
  },
  clearBtn: {
    position: 'absolute', right: '12px',
    background: 'none', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '4px',
  },
  gridItem: {
    position: 'relative', aspectRatio: '1',
    overflow: 'hidden', borderRadius: '10px',
    background: '#e5e7eb', cursor: 'pointer', textDecoration: 'none',
  },
  gridItemWide: {
    gridColumn: 'span 2', aspectRatio: '2/1',
  },
  gridMedia: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  playOverlay: {
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,0,0,0.2)',
  },
  audioItem: {
    width: '100%', height: '100%',
    background: '#ede9fe',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  gridOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
    padding: '20px 8px 6px',
  },
  gridUser: { fontSize: '11px', fontWeight: '600', color: '#fff' },
  skelItem: {
    aspectRatio: '1', borderRadius: '10px',
    background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
    backgroundSize: '200% 100%', animation: 'pulse 1.5s infinite',
  },
  empty: {
    textAlign: 'center', padding: '60px 20px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
  },
  emptyText: { fontSize: '14px', color: '#6b7280', margin: 0 },
}

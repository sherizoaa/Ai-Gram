import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import api from '../utils/api'

const FILTERS = ['All', 'image', 'video', 'audio']

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    api.get('/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All' ? posts : posts.filter(p => p.media_type === filter)

  return (
    <div style={s.page}>
      <Navbar />
      <main style={s.main}>
        {/* Filter tabs */}
        <div style={s.filters}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{ ...s.filterBtn, ...(filter === f ? s.filterActive : {}) }}
            >
              {f === 'All' ? 'All' : f === 'image' ? 'Images' : f === 'video' ? 'Videos' : 'Audio'}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div style={s.feed}>
          {loading && (
            <div style={s.skeletons}>
              {[1, 2].map(i => <div key={i} style={s.skeleton} />)}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={s.empty}>
              <div style={s.emptyIcon}>
                <svg width="40" height="40" fill="none" stroke="#d1d5db" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21,15 16,10 5,21"/>
                </svg>
              </div>
              <p style={s.emptyTitle}>No posts yet</p>
              <p style={s.emptyText}>Be the first to share AI-generated content!</p>
            </div>
          )}

          {filtered.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      </main>
    </div>
  )
}

const s = {
  page: { background: 'var(--color-bg)', minHeight: '100dvh' },
  main: { maxWidth: '600px', margin: '0 auto', padding: '20px 16px' },
  filters: {
    display: 'flex', gap: '8px', marginBottom: '20px',
    overflowX: 'auto', paddingBottom: '4px',
  },
  filterBtn: {
    padding: '7px 16px', borderRadius: 'var(--radius-full)',
    border: '1.5px solid var(--color-border)', background: '#fff',
    fontSize: '13px', fontWeight: '500', color: 'var(--color-text-secondary)',
    cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s ease',
  },
  filterActive: {
    background: 'var(--color-primary)', border: '1.5px solid var(--color-primary)',
    color: '#fff',
  },
  feed: {},
  skeletons: { display: 'flex', flexDirection: 'column', gap: '20px' },
  skeleton: {
    background: '#fff', borderRadius: 'var(--radius-lg)',
    height: '400px', border: '1px solid var(--color-border)',
    animation: 'pulse 1.5s infinite',
    background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
    backgroundSize: '200% 100%',
  },
  empty: {
    textAlign: 'center', padding: '60px 20px',
    background: '#fff', borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--color-border)',
  },
  emptyIcon: {
    width: '72px', height: '72px', borderRadius: '50%',
    background: 'var(--color-bg)', margin: '0 auto 16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { fontSize: '16px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '6px' },
  emptyText: { fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 },
}

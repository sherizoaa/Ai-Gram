import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import api from '../utils/api'

const TABS = [
  { key: 'foryou', label: 'For You', icon: '🌐' },
  { key: 'trending', label: 'Trending', icon: '📈' },
  { key: 'following', label: 'Following', icon: '👥' },
  { key: 'new', label: 'New', icon: '✨' },
]

const fmt = (n) => {
  n = parseInt(n) || 0
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return String(n)
}

export default function Home() {
  const [posts, setPosts] = useState([])
  const [trending, setTrending] = useState([])
  const [creators, setCreators] = useState([])
  const [tab, setTab] = useState('foryou')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/posts'),
      api.get('/posts/trending').catch(() => ({ data: [] })),
      api.get('/users/top').catch(() => ({ data: [] })),
    ]).then(([postsRes, trendRes, creatorsRes]) => {
      setPosts(postsRes.data)
      setTrending(trendRes.data)
      setCreators(creatorsRes.data)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const feedPosts = tab === 'trending' ? trending : posts
  const featuredPost = posts[0]

  return (
    <div style={s.page}>
      <Navbar />
      <main style={s.main}>

        {/* Filter tabs */}
        <div style={s.tabsWrap}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={tab === t.key ? s.tabActive : s.tab}
            >
              {tab === t.key && <span style={{ marginRight: '5px' }}>{t.icon}</span>}
              {t.label}
            </button>
          ))}
          <button style={s.filterIcon} aria-label="Filter">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
          </button>
        </div>

        {loading && (
          <div style={s.skeletonHero} />
        )}

        {/* Hero featured card */}
        {!loading && featuredPost && (tab === 'foryou' || tab === 'new') && (
          <HeroCard post={featuredPost} />
        )}

        {/* Trending Now */}
        {!loading && trending.length > 0 && (tab === 'foryou' || tab === 'trending') && (
          <section style={s.section}>
            <div style={s.sectionHead}>
              <span style={s.sectionTitle}>🔥 Trending Now</span>
              <button style={s.seeAll}>See all →</button>
            </div>
            <div style={s.hScroll}>
              {trending.slice(0, 8).map(post => (
                <TrendCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Top Creators */}
        {!loading && creators.length > 0 && tab === 'foryou' && (
          <section style={s.section}>
            <div style={s.sectionHead}>
              <span style={s.sectionTitle}>✨ Top Creators</span>
            </div>
            <div style={s.hScroll}>
              {creators.map(user => (
                <CreatorCard key={user.id} user={user} />
              ))}
            </div>
          </section>
        )}

        {/* Following tab empty */}
        {!loading && tab === 'following' && (
          <div style={s.empty}>
            <p style={s.emptyTitle}>Follow people to see their posts here</p>
            <p style={s.emptyText}>Discover creators on the Explore page</p>
          </div>
        )}

        {/* No posts state */}
        {!loading && feedPosts.length === 0 && tab !== 'following' && (
          <div style={s.empty}>
            <svg width="40" height="40" fill="none" stroke="#d1d5db" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
            <p style={s.emptyTitle}>No posts yet</p>
            <p style={s.emptyText}>Be the first to share AI content!</p>
          </div>
        )}

      </main>
      <BottomNav />
    </div>
  )
}

function HeroCard({ post }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(parseInt(post.likes_count) || 0)
  const navigate = useNavigate()

  const handleLike = async () => {
    try {
      if (liked) {
        await api.delete(`/posts/${post.id}/like`)
        setLikeCount(c => c - 1)
      } else {
        await api.post(`/posts/${post.id}/like`)
        setLikeCount(c => c + 1)
      }
      setLiked(!liked)
    } catch (err) { console.error(err) }
  }

  return (
    <div style={s.hero}>
      {/* Media */}
      {post.media_type === 'video' ? (
        <video src={post.media_url} style={s.heroMedia} autoPlay muted loop playsInline />
      ) : post.media_type === 'audio' ? (
        <div style={s.heroAudio}>
          <svg width="48" height="48" fill="none" stroke="#7c3aed" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
          </svg>
        </div>
      ) : (
        <img src={post.media_url} alt={post.caption || 'AI content'} style={s.heroMedia} />
      )}

      {/* Gradient overlays */}
      <div style={s.heroGradTop} />
      <div style={s.heroGradBottom} />

      {/* Top: author */}
      <div style={s.heroTop}>
        <Link to={`/profile/${post.user_id}`} style={s.heroAuthor}>
          <div style={s.heroAvatar}>{post.username?.[0]?.toUpperCase() || '?'}</div>
          <div>
            <div style={s.heroUsername}>@{post.username}</div>
            <div style={s.heroRole}>AI Artist</div>
          </div>
          <div style={s.verified}>
            <svg width="14" height="14" fill="#7c3aed" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
        </Link>
        <button style={s.moreBtn}>
          <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24">
            <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
          </svg>
        </button>
      </div>

      {/* Right: actions */}
      <div style={s.heroActions}>
        <button style={s.heroAction} onClick={handleLike}>
          <svg width="26" height="26" fill={liked ? '#ef4444' : 'none'} stroke={liked ? '#ef4444' : '#fff'} strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          <span style={s.heroActionCount}>{fmt(likeCount)}</span>
        </button>

        <button style={s.heroAction}>
          <svg width="26" height="26" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          <span style={s.heroActionCount}>{fmt(post.comments_count)}</span>
        </button>

        <button style={s.heroAction}>
          <svg width="26" height="26" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
          </svg>
          <span style={s.heroActionCount}>Remix</span>
        </button>

        <button style={s.heroAction}>
          <svg width="26" height="26" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          <span style={s.heroActionCount}>Share</span>
        </button>
      </div>

      {/* Bottom: title + tags + badge */}
      <div style={s.heroBottom}>
        {post.caption && (
          <h2 style={s.heroTitle}>{post.caption}</h2>
        )}
        {post.tags?.length > 0 && (
          <div style={s.heroTags}>
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} style={s.heroTag}>#{tag}</span>
            ))}
          </div>
        )}
        <div style={s.heroBadge}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          AI Generated
        </div>
        {/* Pagination dots */}
        <div style={s.dots}>
          <span style={{ ...s.dot, background: '#7c3aed' }} />
          <span style={s.dot} />
          <span style={s.dot} />
          <span style={s.dot} />
        </div>
      </div>
    </div>
  )
}

function TrendCard({ post }) {
  return (
    <Link to={`/profile/${post.user_id}`} style={s.trendCard}>
      <div style={s.trendThumb}>
        {post.media_type === 'video' ? (
          <>
            <video src={post.media_url} style={s.trendMedia} />
            <div style={s.playBtn}>
              <svg width="16" height="16" fill="#fff" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
          </>
        ) : post.media_type === 'audio' ? (
          <div style={{ ...s.trendMedia, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" fill="none" stroke="#7c3aed" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
        ) : (
          <>
            <img src={post.media_url} alt={post.caption} style={s.trendMedia} loading="lazy" />
            {post.media_type === 'video' && (
              <div style={s.playBtn}>
                <svg width="16" height="16" fill="#fff" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
            )}
          </>
        )}
      </div>
      <p style={s.trendTitle}>{post.caption || 'Untitled'}</p>
      <div style={s.trendAuthor}>
        <span style={s.trendUser}>@{post.username}</span>
        <svg width="12" height="12" fill="#7c3aed" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      </div>
    </Link>
  )
}

function CreatorCard({ user }) {
  const fmt2 = (n) => {
    n = parseInt(n) || 0
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K'
    return String(n)
  }
  return (
    <Link to={`/profile/${user.id}`} style={s.creatorCard}>
      <div style={s.creatorRing}>
        <div style={s.creatorAvatar}>{user.username?.[0]?.toUpperCase() || '?'}</div>
      </div>
      <span style={s.creatorName}>@{user.username}</span>
      <span style={s.creatorFollowers}>{fmt2(user.followers_count)} followers</span>
    </Link>
  )
}

const s = {
  page: { background: '#f5f5f8', minHeight: '100dvh', paddingBottom: '80px' },
  main: { maxWidth: '600px', margin: '0 auto', padding: '12px 16px' },

  /* Tabs */
  tabsWrap: {
    display: 'flex', gap: '8px', marginBottom: '16px',
    overflowX: 'auto', paddingBottom: '4px',
    scrollbarWidth: 'none', msOverflowStyle: 'none',
  },
  tab: {
    padding: '8px 16px', borderRadius: '9999px',
    border: '1.5px solid #e5e7eb', background: '#fff',
    fontSize: '13px', fontWeight: '500', color: '#6b7280',
    cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
  },
  tabActive: {
    padding: '8px 16px', borderRadius: '9999px',
    border: '1.5px solid #111827', background: '#111827',
    fontSize: '13px', fontWeight: '600', color: '#fff',
    cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
    display: 'flex', alignItems: 'center',
  },
  filterIcon: {
    width: '36px', height: '36px', borderRadius: '9999px',
    border: '1.5px solid #e5e7eb', background: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0, color: '#6b7280',
  },

  /* Hero */
  skeletonHero: {
    width: '100%', height: '460px', borderRadius: '20px',
    background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
    backgroundSize: '200% 100%', animation: 'pulse 1.5s infinite',
    marginBottom: '24px',
  },
  hero: {
    position: 'relative', borderRadius: '20px', overflow: 'hidden',
    marginBottom: '24px', background: '#1a1a2e',
    aspectRatio: '4/5', maxHeight: '520px',
  },
  heroMedia: {
    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
  },
  heroAudio: {
    width: '100%', height: '100%',
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  heroGradTop: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '120px',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
    pointerEvents: 'none',
  },
  heroGradBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '220px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
    pointerEvents: 'none',
  },
  heroTop: {
    position: 'absolute', top: '14px', left: '14px', right: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 2,
  },
  heroAuthor: {
    display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none',
  },
  heroAvatar: {
    width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: '#fff', fontSize: '16px', fontWeight: '700',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '2px solid rgba(255,255,255,0.6)',
  },
  heroUsername: { fontSize: '14px', fontWeight: '700', color: '#fff' },
  heroRole: { fontSize: '11px', color: 'rgba(255,255,255,0.75)', marginTop: '1px' },
  verified: {
    width: '20px', height: '20px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.9)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  moreBtn: {
    background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
  },

  /* Right actions */
  heroActions: {
    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
    display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 2,
    alignItems: 'center',
  },
  heroAction: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
  },
  heroActionCount: {
    fontSize: '12px', fontWeight: '600', color: '#fff',
  },

  /* Bottom overlay */
  heroBottom: {
    position: 'absolute', bottom: '16px', left: '14px', right: '70px', zIndex: 2,
  },
  heroTitle: {
    fontSize: '20px', fontWeight: '800', color: '#fff',
    margin: '0 0 8px', lineHeight: '1.3',
    textShadow: '0 1px 4px rgba(0,0,0,0.3)',
  },
  heroTags: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' },
  heroTag: {
    fontSize: '12px', fontWeight: '500', color: '#fff',
    background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
    padding: '4px 10px', borderRadius: '9999px',
    border: '1px solid rgba(255,255,255,0.25)',
  },
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.25)',
    color: '#fff', fontSize: '11px', fontWeight: '600',
    padding: '5px 10px', borderRadius: '9999px',
    marginBottom: '10px',
  },
  dots: { display: 'flex', gap: '5px', alignItems: 'center' },
  dot: {
    width: '6px', height: '6px', borderRadius: '3px',
    background: 'rgba(255,255,255,0.4)',
    transition: 'all 0.2s',
  },

  /* Sections */
  section: { marginBottom: '24px' },
  sectionHead: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: '12px',
  },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#111827' },
  seeAll: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '13px', fontWeight: '600', color: '#7c3aed',
  },

  /* Horizontal scroll */
  hScroll: {
    display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '6px',
    scrollbarWidth: 'none', msOverflowStyle: 'none',
  },

  /* Trend card */
  trendCard: {
    flexShrink: 0, width: '130px', textDecoration: 'none', cursor: 'pointer',
  },
  trendThumb: {
    position: 'relative', width: '130px', height: '170px',
    borderRadius: '14px', overflow: 'hidden', marginBottom: '7px',
    background: '#e5e7eb',
  },
  trendMedia: {
    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
  },
  playBtn: {
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,0,0,0.25)',
  },
  trendTitle: {
    fontSize: '12px', fontWeight: '600', color: '#111827',
    margin: '0 0 3px', lineHeight: '1.3',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  trendAuthor: { display: 'flex', alignItems: 'center', gap: '3px' },
  trendUser: { fontSize: '11px', color: '#6b7280', fontWeight: '500' },

  /* Creator card */
  creatorCard: {
    flexShrink: 0, display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '5px', width: '86px',
    textDecoration: 'none', cursor: 'pointer',
  },
  creatorRing: {
    padding: '2px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
  },
  creatorAvatar: {
    width: '64px', height: '64px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: '#fff', fontSize: '22px', fontWeight: '700',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '2px solid #fff',
  },
  creatorName: {
    fontSize: '11px', fontWeight: '600', color: '#111827',
    textAlign: 'center',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%',
  },
  creatorFollowers: { fontSize: '10px', color: '#6b7280', textAlign: 'center' },

  /* Empty */
  empty: {
    textAlign: 'center', padding: '48px 20px',
    background: '#fff', borderRadius: '20px',
    border: '1px solid #e5e7eb',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
  },
  emptyTitle: { fontSize: '15px', fontWeight: '600', color: '#111827', margin: 0 },
  emptyText: { fontSize: '13px', color: '#6b7280', margin: 0 },
}

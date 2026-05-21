import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import api from '../utils/api'

export default function Profile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const isOwn = currentUser.id === parseInt(id)

  useEffect(() => {
    api.get(`/users/${id}`)
      .then(res => setProfile(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  const handleFollow = async () => {
    try {
      if (following) {
        await api.delete(`/users/${id}/follow`)
      } else {
        await api.post(`/users/${id}/follow`)
      }
      setFollowing(!following)
      setProfile(p => ({
        ...p,
        followers_count: following ? p.followers_count - 1 : p.followers_count + 1
      }))
    } catch (err) { console.error(err) }
  }

  if (loading) return (
    <div style={s.page}>
      <Navbar />
      <BottomNav />
      <div style={s.loading}>
        <div style={s.loadingAvatar} />
        <div style={s.loadingLine} />
      </div>
    </div>
  )

  if (!profile) return (
    <div style={s.page}>
      <Navbar />
      <BottomNav />
      <div style={s.notFound}>User not found</div>
    </div>
  )

  return (
    <div style={s.page}>
      <Navbar />
      <main style={s.main}>
        {/* Profile header card */}
        <div style={s.profileCard}>
          <div style={s.profileTop}>
            <div style={s.avatar}>{profile.username?.[0]?.toUpperCase()}</div>
            <div style={s.profileInfo}>
              <h1 style={s.username}>@{profile.username}</h1>
              {profile.bio && <p style={s.bio}>{profile.bio}</p>}
              <div style={s.stats}>
                <div style={s.stat}>
                  <span style={s.statNum}>{profile.posts?.length || 0}</span>
                  <span style={s.statLabel}>Posts</span>
                </div>
                <div style={s.statDivider} />
                <div style={s.stat}>
                  <span style={s.statNum}>{profile.followers_count || 0}</span>
                  <span style={s.statLabel}>Followers</span>
                </div>
                <div style={s.statDivider} />
                <div style={s.stat}>
                  <span style={s.statNum}>{profile.following_count || 0}</span>
                  <span style={s.statLabel}>Following</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={s.profileActions}>
            {isOwn ? (
              <button style={s.editBtn}>Edit Profile</button>
            ) : (
              <button
                onClick={handleFollow}
                style={following ? s.unfollowBtn : s.followBtn}
              >
                {following ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        {/* Posts grid */}
        {profile.posts?.length > 0 ? (
          <>
            <h2 style={s.sectionTitle}>Posts</h2>
            <div style={s.postsGrid}>
              {profile.posts.map(post => (
                <div key={post.id} style={s.gridItem}>
                  {post.media_type === 'video' ? (
                    <video src={post.media_url} style={s.gridMedia} />
                  ) : post.media_type === 'audio' ? (
                    <div style={s.audioGridItem}>
                      <svg width="24" height="24" fill="none" stroke="#7c3aed" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                      </svg>
                    </div>
                  ) : (
                    <img src={post.media_url} alt={post.caption} style={s.gridMedia} loading="lazy" />
                  )}
                  {post.media_type && (
                    <span style={s.gridBadge}>{post.media_type}</span>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={s.noPosts}>
            <svg width="40" height="40" fill="none" stroke="#d1d5db" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
            <p style={s.noPostsText}>No posts yet</p>
            {isOwn && (
              <Link to="/upload" style={s.uploadLink}>Share your first creation →</Link>
            )}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}

const s = {
  page: { background: '#f5f5f8', minHeight: '100dvh', paddingBottom: '80px' },
  main: { maxWidth: '680px', margin: '0 auto', padding: '24px 16px' },
  loading: { maxWidth: '680px', margin: '40px auto', padding: '0 16px' },
  loadingAvatar: { width: '80px', height: '80px', borderRadius: '50%', background: '#e5e7eb', marginBottom: '16px' },
  loadingLine: { width: '200px', height: '20px', borderRadius: '4px', background: '#e5e7eb' },
  notFound: { textAlign: 'center', padding: '60px', color: 'var(--color-text-secondary)' },

  profileCard: {
    background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
    padding: '24px', border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm)', marginBottom: '24px',
  },
  profileTop: { display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '20px' },
  avatar: {
    width: '80px', height: '80px', borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: '#fff', fontSize: '30px', fontWeight: '700',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
  },
  profileInfo: { flex: 1, minWidth: 0 },
  username: { fontSize: '20px', fontWeight: '700', margin: '0 0 6px', color: 'var(--color-text)' },
  bio: { fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 14px', lineHeight: '1.5' },
  stats: { display: 'flex', alignItems: 'center', gap: '16px' },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNum: { fontSize: '18px', fontWeight: '700', color: 'var(--color-text)' },
  statLabel: { fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' },
  statDivider: { width: '1px', height: '28px', background: 'var(--color-border)' },
  profileActions: {},
  followBtn: {
    padding: '10px 28px', borderRadius: 'var(--radius-sm)',
    background: 'var(--color-primary)', border: 'none',
    color: '#fff', fontSize: '14px', fontWeight: '600',
    cursor: 'pointer', boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
  },
  unfollowBtn: {
    padding: '10px 28px', borderRadius: 'var(--radius-sm)',
    background: 'transparent', border: '1.5px solid var(--color-border)',
    color: 'var(--color-text)', fontSize: '14px', fontWeight: '600',
    cursor: 'pointer',
  },
  editBtn: {
    padding: '10px 28px', borderRadius: 'var(--radius-sm)',
    background: 'transparent', border: '1.5px solid var(--color-border)',
    color: 'var(--color-text)', fontSize: '14px', fontWeight: '600',
    cursor: 'pointer',
  },

  sectionTitle: { fontSize: '16px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '14px' },
  postsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px',
  },
  gridItem: {
    position: 'relative', aspectRatio: '1',
    overflow: 'hidden', borderRadius: 'var(--radius-sm)',
    background: '#f3f4f6', cursor: 'pointer',
  },
  gridMedia: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  audioGridItem: {
    width: '100%', height: '100%', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: 'var(--color-primary-light)',
  },
  gridBadge: {
    position: 'absolute', bottom: '6px', right: '6px',
    background: 'rgba(0,0,0,0.55)', color: '#fff',
    fontSize: '10px', fontWeight: '600', padding: '2px 6px',
    borderRadius: '4px', textTransform: 'uppercase', backdropFilter: 'blur(4px)',
  },
  noPosts: {
    background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--color-border)', padding: '48px',
    textAlign: 'center', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '10px',
  },
  noPostsText: { fontSize: '15px', fontWeight: '500', color: 'var(--color-text-secondary)', margin: 0 },
  uploadLink: { fontSize: '14px', color: 'var(--color-primary)', fontWeight: '600' },
}

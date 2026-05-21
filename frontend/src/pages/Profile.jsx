import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import api from '../utils/api'

export default function Profile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [following, setFollowing] = useState(false)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    api.get(`/users/${id}`)
      .then(res => setProfile(res.data))
      .catch(err => console.error(err))
  }, [id])

  const handleFollow = async () => {
    try {
      if (following) {
        await api.delete(`/users/${id}/follow`)
      } else {
        await api.post(`/users/${id}/follow`)
      }
      setFollowing(!following)
    } catch (err) {
      console.error(err)
    }
  }

  if (!profile) return <div style={{ background: '#0a0a0f', minHeight: '100vh' }}><Navbar /></div>

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>{profile.username?.[0]?.toUpperCase()}</div>
          <div>
            <h2 style={styles.username}>@{profile.username}</h2>
            {profile.bio && <p style={styles.bio}>{profile.bio}</p>}
            <div style={styles.stats}>
              <span style={styles.stat}><strong>{profile.posts?.length || 0}</strong> posts</span>
              <span style={styles.stat}><strong>{profile.followers_count}</strong> followers</span>
              <span style={styles.stat}><strong>{profile.following_count}</strong> following</span>
            </div>
          </div>
          {currentUser.id !== parseInt(id) && (
            <button onClick={handleFollow} style={{ ...styles.followBtn, background: following ? 'transparent' : '#7c3aed', border: following ? '1px solid #7c3aed' : 'none' }}>
              {following ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        <div style={styles.posts}>
          {profile.posts?.map(post => <PostCard key={post.id} post={{ ...post, username: profile.username }} />)}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { background: '#0a0a0f', minHeight: '100vh' },
  container: { maxWidth: '600px', margin: '0 auto', padding: '32px 16px' },
  profileHeader: { display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap' },
  avatar: { width: '72px', height: '72px', borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '28px', fontWeight: 'bold', flexShrink: 0 },
  username: { color: '#e0e0e0', margin: '0 0 6px', fontSize: '20px' },
  bio: { color: '#888', fontSize: '14px', margin: '0 0 10px' },
  stats: { display: 'flex', gap: '16px' },
  stat: { color: '#888', fontSize: '13px' },
  followBtn: { marginLeft: 'auto', padding: '8px 20px', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  posts: {}
}

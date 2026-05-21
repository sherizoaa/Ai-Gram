import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import api from '../utils/api'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.feed}>
        {loading && <p style={styles.msg}>Loading feed...</p>}
        {!loading && posts.length === 0 && (
          <p style={styles.msg}>No posts yet. Be the first to upload AI content!</p>
        )}
        {posts.map(post => <PostCard key={post.id} post={post} />)}
      </div>
    </div>
  )
}

const styles = {
  page: { background: '#0a0a0f', minHeight: '100vh' },
  feed: { maxWidth: '600px', margin: '0 auto', padding: '24px 16px' },
  msg: { color: '#555', textAlign: 'center', marginTop: '60px', fontSize: '15px' }
}

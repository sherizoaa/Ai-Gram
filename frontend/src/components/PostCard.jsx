import { useState } from 'react'
import api from '../utils/api'

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])

  const handleLike = async () => {
    try {
      if (liked) {
        await api.delete(`/posts/${post.id}/like`)
      } else {
        await api.post(`/posts/${post.id}/like`)
      }
      setLiked(!liked)
    } catch (err) {
      console.error(err)
    }
  }

  const loadComments = async () => {
    if (!showComments) {
      const res = await api.get(`/posts/${post.id}/comments`)
      setComments(res.data)
    }
    setShowComments(!showComments)
  }

  const submitComment = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post(`/posts/${post.id}/comments`, { text: comment })
      setComments([...comments, res.data])
      setComment('')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.avatar}>{post.username?.[0]?.toUpperCase()}</div>
        <span style={styles.username}>@{post.username}</span>
        {post.media_type && <span style={styles.tag}>{post.media_type}</span>}
      </div>

      {post.media_type === 'video' ? (
        <video src={post.media_url} controls style={styles.media} />
      ) : post.media_type === 'audio' ? (
        <audio src={post.media_url} controls style={styles.audio} />
      ) : (
        <img src={post.media_url} alt={post.caption} style={styles.media} />
      )}

      <div style={styles.body}>
        {post.caption && <p style={styles.caption}>{post.caption}</p>}
        {post.tags?.length > 0 && (
          <div style={styles.tags}>
            {post.tags.map(tag => <span key={tag} style={styles.tagChip}>#{tag}</span>)}
          </div>
        )}
        <div style={styles.actions}>
          <button onClick={handleLike} style={{ ...styles.actionBtn, color: liked ? '#a78bfa' : '#888' }}>
            {liked ? '♥' : '♡'} Like
          </button>
          <button onClick={loadComments} style={styles.actionBtn}>
            💬 Comments
          </button>
        </div>

        {showComments && (
          <div style={styles.comments}>
            {comments.map(c => (
              <div key={c.id} style={styles.comment}>
                <strong style={{ color: '#a78bfa' }}>@{c.username}</strong>
                <span style={{ color: '#ccc', marginLeft: '8px' }}>{c.text}</span>
              </div>
            ))}
            <form onSubmit={submitComment} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <input
                style={styles.commentInput}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Add comment..."
              />
              <button type="submit" style={styles.commentBtn}>Post</button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  card: { background: '#13131a', border: '1px solid #2a2a3a', borderRadius: '16px', marginBottom: '24px', overflow: 'hidden' },
  header: { display: 'flex', alignItems: 'center', padding: '12px 16px', gap: '10px' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' },
  username: { color: '#e0e0e0', fontWeight: '600', fontSize: '14px' },
  tag: { marginLeft: 'auto', background: '#1e1e2e', color: '#a78bfa', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', textTransform: 'uppercase' },
  media: { width: '100%', maxHeight: '500px', objectFit: 'cover', display: 'block' },
  audio: { width: '100%', padding: '12px 16px' },
  body: { padding: '12px 16px' },
  caption: { color: '#ccc', fontSize: '14px', marginBottom: '8px' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' },
  tagChip: { color: '#7c3aed', fontSize: '12px' },
  actions: { display: 'flex', gap: '16px' },
  actionBtn: { background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px', padding: '4px 0' },
  comments: { marginTop: '12px', borderTop: '1px solid #2a2a3a', paddingTop: '12px' },
  comment: { marginBottom: '6px', fontSize: '13px' },
  commentInput: { flex: 1, padding: '8px', background: '#1e1e2e', border: '1px solid #2a2a3a', borderRadius: '8px', color: '#fff', fontSize: '13px' },
  commentBtn: { padding: '8px 12px', background: '#7c3aed', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '13px' }
}

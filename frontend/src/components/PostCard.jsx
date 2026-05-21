import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [likeCount, setLikeCount] = useState(0)

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

  const loadComments = async () => {
    if (!showComments) {
      try {
        const res = await api.get(`/posts/${post.id}/comments`)
        setComments(res.data)
      } catch (err) { console.error(err) }
    }
    setShowComments(!showComments)
  }

  const submitComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    try {
      const res = await api.post(`/posts/${post.id}/comments`, { text: comment })
      setComments(prev => [...prev, res.data])
      setComment('')
    } catch (err) { console.error(err) }
  }

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'just now'
    if (m < 60) return `${m}m`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h`
    return `${Math.floor(h / 24)}d`
  }

  const mediaTypeLabel = { image: 'AI Image', video: 'AI Video', audio: 'AI Audio' }

  return (
    <article style={s.card}>
      {/* Header */}
      <div style={s.header}>
        <Link to={`/profile/${post.user_id}`} style={s.authorLink}>
          <div style={s.avatar}>{post.username?.[0]?.toUpperCase() || '?'}</div>
          <div>
            <div style={s.username}>@{post.username}</div>
            {post.created_at && <div style={s.time}>{timeAgo(post.created_at)}</div>}
          </div>
        </Link>
        {post.media_type && (
          <span style={s.typeBadge}>{mediaTypeLabel[post.media_type] || post.media_type}</span>
        )}
      </div>

      {/* Media */}
      <div style={s.mediaWrap}>
        {post.media_type === 'video' ? (
          <video src={post.media_url} controls style={s.media} />
        ) : post.media_type === 'audio' ? (
          <div style={s.audioWrap}>
            <div style={s.audioIcon}>
              <svg width="32" height="32" fill="none" stroke="#7c3aed" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              </svg>
            </div>
            <audio src={post.media_url} controls style={{ width: '100%' }} />
          </div>
        ) : (
          <img src={post.media_url} alt={post.caption || 'AI content'} style={s.media} loading="lazy" />
        )}
      </div>

      {/* Body */}
      <div style={s.body}>
        {/* Actions */}
        <div style={s.actions}>
          <button onClick={handleLike} style={{ ...s.actionBtn, color: liked ? '#ef4444' : 'var(--color-text-secondary)' }} aria-label="Like">
            <svg width="22" height="22" fill={liked ? '#ef4444' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            {likeCount > 0 && <span style={s.count}>{likeCount}</span>}
          </button>

          <button onClick={loadComments} style={{ ...s.actionBtn, color: showComments ? 'var(--color-primary)' : 'var(--color-text-secondary)' }} aria-label="Comments">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            {comments.length > 0 && <span style={s.count}>{comments.length}</span>}
          </button>
        </div>

        {/* Caption */}
        {post.caption && (
          <p style={s.caption}>
            <span style={s.captionUser}>@{post.username}</span> {post.caption}
          </p>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div style={s.tags}>
            {post.tags.map(tag => <span key={tag} style={s.tag}>#{tag}</span>)}
          </div>
        )}

        {/* Comments */}
        {showComments && (
          <div style={s.commentsSection}>
            {comments.length > 0 && (
              <div style={s.commentsList}>
                {comments.map(c => (
                  <div key={c.id} style={s.comment}>
                    <span style={s.commentUser}>@{c.username}</span>
                    <span style={s.commentText}>{c.text}</span>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={submitComment} style={s.commentForm}>
              <input
                style={s.commentInput}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Add a comment..."
                aria-label="Add a comment"
              />
              <button type="submit" style={s.commentSubmit} disabled={!comment.trim()}>
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  )
}

const s = {
  card: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    marginBottom: '20px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
    transition: 'box-shadow 0.2s ease',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 16px',
  },
  authorLink: { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' },
  avatar: {
    width: '38px', height: '38px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: '#fff', fontSize: '15px', fontWeight: '600',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  username: { fontSize: '14px', fontWeight: '600', color: 'var(--color-text)' },
  time: { fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '1px' },
  typeBadge: {
    fontSize: '11px', fontWeight: '600', letterSpacing: '0.3px',
    padding: '4px 10px', borderRadius: 'var(--radius-full)',
    background: 'var(--color-primary-light)', color: 'var(--color-primary)',
    textTransform: 'uppercase',
  },
  mediaWrap: { background: '#f3f4f6', overflow: 'hidden' },
  media: { width: '100%', maxHeight: '520px', objectFit: 'cover', display: 'block' },
  audioWrap: {
    padding: '24px 16px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
    background: 'linear-gradient(135deg, #ede9fe, #f5f3ff)',
  },
  audioIcon: {
    width: '64px', height: '64px', borderRadius: '50%',
    background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: 'var(--shadow-md)',
  },
  body: { padding: '12px 16px 16px' },
  actions: { display: 'flex', gap: '16px', marginBottom: '10px' },
  actionBtn: {
    display: 'flex', alignItems: 'center', gap: '5px',
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '14px', fontWeight: '500', padding: '4px 0',
    transition: 'color 0.15s ease',
  },
  count: { fontSize: '13px', fontWeight: '500' },
  caption: { fontSize: '14px', color: 'var(--color-text)', lineHeight: '1.5', marginBottom: '8px' },
  captionUser: { fontWeight: '600', color: 'var(--color-text)', marginRight: '4px' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' },
  tag: { fontSize: '13px', color: 'var(--color-primary)', fontWeight: '500' },
  commentsSection: { borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '8px' },
  commentsList: { marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '6px' },
  comment: { fontSize: '13px', lineHeight: '1.4' },
  commentUser: { fontWeight: '600', color: 'var(--color-text)', marginRight: '6px' },
  commentText: { color: 'var(--color-text-secondary)' },
  commentForm: { display: 'flex', gap: '8px' },
  commentInput: {
    flex: 1, padding: '9px 12px', borderRadius: 'var(--radius-full)',
    border: '1.5px solid var(--color-border)', background: 'var(--color-bg)',
    fontSize: '13px', color: 'var(--color-text)', outline: 'none',
  },
  commentSubmit: {
    padding: '9px 16px', borderRadius: 'var(--radius-full)',
    background: 'var(--color-primary)', border: 'none',
    color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
  },
}

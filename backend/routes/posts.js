const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const auth = require('../middleware/auth')

// Get all posts (feed) with counts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT posts.*, users.username, users.avatar_url,
        COUNT(DISTINCT l.user_id) AS likes_count,
        COUNT(DISTINCT c.id) AS comments_count
       FROM posts
       JOIN users ON posts.user_id = users.id
       LEFT JOIN likes l ON l.post_id = posts.id
       LEFT JOIN comments c ON c.post_id = posts.id
       GROUP BY posts.id, users.username, users.avatar_url
       ORDER BY posts.created_at DESC LIMIT 50`
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get trending posts (most liked)
router.get('/trending', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT posts.*, users.username, users.avatar_url,
        COUNT(DISTINCT l.user_id) AS likes_count,
        COUNT(DISTINCT c.id) AS comments_count
       FROM posts
       JOIN users ON posts.user_id = users.id
       LEFT JOIN likes l ON l.post_id = posts.id
       LEFT JOIN comments c ON c.post_id = posts.id
       GROUP BY posts.id, users.username, users.avatar_url
       ORDER BY likes_count DESC, posts.created_at DESC LIMIT 20`
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT posts.*, users.username, users.avatar_url
       FROM posts JOIN users ON posts.user_id = users.id
       WHERE posts.id = $1`,
      [req.params.id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Post not found' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create post
router.post('/', auth, async (req, res) => {
  const { media_url, media_type, caption, tags } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO posts (user_id, media_url, media_type, caption, tags) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, media_url, media_type, caption, tags]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Like post
router.post('/:id/like', auth, async (req, res) => {
  try {
    await pool.query(
      'INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, req.params.id]
    )
    res.json({ liked: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Unlike post
router.delete('/:id/like', auth, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
      [req.user.id, req.params.id]
    )
    res.json({ liked: false })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get comments for post
router.get('/:id/comments', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT comments.*, users.username, users.avatar_url
       FROM comments JOIN users ON comments.user_id = users.id
       WHERE comments.post_id = $1 ORDER BY comments.created_at ASC`,
      [req.params.id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Add comment
router.post('/:id/comments', auth, async (req, res) => {
  const { text } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO comments (user_id, post_id, text) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, req.params.id, text]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router

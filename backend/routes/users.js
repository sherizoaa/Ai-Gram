const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const auth = require('../middleware/auth')

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, username, avatar_url, bio, created_at FROM users WHERE id = $1',
      [req.params.id]
    )
    if (!user.rows[0]) return res.status(404).json({ error: 'User not found' })

    const posts = await pool.query(
      'SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC',
      [req.params.id]
    )

    const followers = await pool.query(
      'SELECT COUNT(*) FROM follows WHERE following_id = $1',
      [req.params.id]
    )

    const following = await pool.query(
      'SELECT COUNT(*) FROM follows WHERE follower_id = $1',
      [req.params.id]
    )

    res.json({
      ...user.rows[0],
      posts: posts.rows,
      followers_count: parseInt(followers.rows[0].count),
      following_count: parseInt(following.rows[0].count)
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Follow user
router.post('/:id/follow', auth, async (req, res) => {
  try {
    await pool.query(
      'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, req.params.id]
    )
    res.json({ following: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Unfollow user
router.delete('/:id/follow', auth, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
      [req.user.id, req.params.id]
    )
    res.json({ following: false })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update profile
router.put('/me', auth, async (req, res) => {
  const { bio, avatar_url } = req.body
  try {
    const result = await pool.query(
      'UPDATE users SET bio = $1, avatar_url = $2 WHERE id = $3 RETURNING id, username, email, bio, avatar_url',
      [bio, avatar_url, req.user.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router

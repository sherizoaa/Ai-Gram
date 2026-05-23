const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/posts', require('./routes/posts'))
app.use('/api/users', require('./routes/users'))
app.use('/api/upload', require('./routes/upload'))

// Health check for Render
app.get('/health', (req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001

require('./config/initDb')().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}).catch(err => {
  console.error('DB init failed:', err)
  process.exit(1)
})

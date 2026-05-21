const express = require('express')
const router = express.Router()
const multer = require('multer')
const cloudinary = require('../config/cloudinary')
const auth = require('../middleware/auth')
const { Readable } = require('stream')

// Use memory storage — pipe buffer to Cloudinary
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/', 'video/', 'audio/']
    if (allowed.some(type => file.mimetype.startsWith(type))) {
      cb(null, true)
    } else {
      cb(new Error('Only image, video, and audio files allowed'))
    }
  }
})

router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' })

    const isVideo = req.file.mimetype.startsWith('video/')
    const isAudio = req.file.mimetype.startsWith('audio/')
    const resourceType = isVideo ? 'video' : isAudio ? 'video' : 'image'
    const mediaType = isVideo ? 'video' : isAudio ? 'audio' : 'image'

    // Stream buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: 'aigram',
          transformation: isVideo ? [{ quality: 'auto' }] : [{ quality: 'auto', fetch_format: 'auto' }]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      Readable.from(req.file.buffer).pipe(stream)
    })

    res.json({
      url: result.secure_url,
      media_type: mediaType,
      public_id: result.public_id
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router

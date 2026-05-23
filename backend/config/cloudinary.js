const cloudinary = require('cloudinary').v2
require('dotenv').config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dxyxt4vj2',
  api_key: process.env.CLOUDINARY_API_KEY || '823666518853651',
  api_secret: process.env.CLOUDINARY_API_SECRET || '7zQuj3vrFd-p62nMlnfpwS93iag'
})

module.exports = cloudinary

const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    preferredChannel: String,
    message: String,
  },
  { timestamps: true }
)

module.exports = mongoose.model('Contact', contactSchema)

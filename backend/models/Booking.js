const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    mode: String,
    sessionType: String,
    isFirstSession: Boolean,
    date: String,
    time: String,
    notes: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Booking', bookingSchema)

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
    paymentScreenshot: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'verified', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

bookingSchema.index({ date: 1, time: 1 }, { unique: true })

module.exports = mongoose.model('Booking', bookingSchema)

const mongoose = require('mongoose')

const sessionPriceSchema = new mongoose.Schema(
  {
    sessionType: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('SessionPrice', sessionPriceSchema)

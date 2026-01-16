const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    discountAmount: { type: Number, required: true },
    isPercentage: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    maxRedemptions: { type: Number, default: 0 },
    redeemedCount: { type: Number, default: 0 },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
)

couponSchema.methods.isValid = function () {
  const notExpired = !this.expiresAt || this.expiresAt > new Date()
  const underLimit = !this.maxRedemptions || this.redeemedCount < this.maxRedemptions
  return this.isActive && notExpired && underLimit
}

module.exports = mongoose.model('Coupon', couponSchema)

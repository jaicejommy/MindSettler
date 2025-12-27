const mongoose = require('mongoose')

const corporateSchema = new mongoose.Schema(
  {
    organizationName: String,
    contactPerson: String,
    email: String,
    phone: String,
    requirements: String,
    groupSize: String,
  },
  { timestamps: true }
)

module.exports = mongoose.model('CorporateRequest', corporateSchema)

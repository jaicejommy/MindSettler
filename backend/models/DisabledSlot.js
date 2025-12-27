const mongoose = require('mongoose')

const disabledSlotSchema = new mongoose.Schema({
  date: String,
  time: String,
})

module.exports = mongoose.model('DisabledSlot', disabledSlotSchema)

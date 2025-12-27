const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

// Models
const Booking = require('./models/Booking')
const DisabledSlot = require('./models/DisabledSlot')
const Contact = require('./models/Contact')
const CorporateRequest = require('./models/CorporateRequest')

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  }),
)

// Fixed daily slots
const DAILY_SLOTS = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00']

// Utility: get available slots for a date
async function getAvailableSlots(date) {
  // Booked slots (pending or confirmed)
  const bookings = await Booking.find({
    date,
    status: { $in: ['pending', 'confirmed'] },
  }).select('time')

  const takenSlots = new Set(bookings.map((b) => b.time))

  // Disabled slots
  const disabled = await DisabledSlot.find({ date }).select('time')
  const disabledSlots = new Set(disabled.map((d) => d.time))

  return DAILY_SLOTS.map((time) => ({
    time,
    isAvailable: !takenSlots.has(time) && !disabledSlots.has(time),
  }))
}

// ================= ROUTES =================

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'MindSettler backend' })
})

// Get slots for a date
app.get('/api/slots', async (req, res) => {
  try {
    const { date } = req.query
    if (!date) {
      return res
        .status(400)
        .json({ message: 'date query param is required (YYYY-MM-DD)' })
    }

    const slots = await getAvailableSlots(date)
    res.json({ date, slots })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch slots' })
  }
})

// Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      mode,
      sessionType,
      isFirstSession,
      date,
      time,
      notes,
    } = req.body || {}

    if (!name || !email || !date || !time) {
      return res
        .status(400)
        .json({ message: 'name, email, date and time are required' })
    }

    const slots = await getAvailableSlots(date)
    const selected = slots.find((s) => s.time === time)

    if (!selected || !selected.isAvailable) {
      return res
        .status(400)
        .json({ message: 'Selected slot is no longer available' })
    }

    const booking = await Booking.create({
      name,
      email,
      phone: phone || '',
      mode: mode || 'online',
      sessionType: sessionType || 'individual',
      isFirstSession: Boolean(isFirstSession),
      date,
      time,
      notes: notes || '',
      status: 'pending',
    })

    res.status(201).json({
      message:
        'Booking request received. You will be contacted for confirmation.',
      booking,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to create booking' })
  }
})

// List bookings (admin)
app.get('/api/bookings', async (_req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 })
    res.json({ bookings })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch bookings' })
  }
})

// Update booking status (admin)
app.patch('/api/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body || {}

    if (!['pending', 'confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    )

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    res.json({ message: 'Status updated', booking })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to update status' })
  }
})

// Disable / enable slot (admin)
app.post('/api/slots/disable', async (req, res) => {
  try {
    const { date, time, disabled } = req.body || {}

    if (!date || !time) {
      return res
        .status(400)
        .json({ message: 'date and time are required' })
    }

    if (disabled) {
      await DisabledSlot.updateOne(
        { date, time },
        { date, time },
        { upsert: true },
      )
    } else {
      await DisabledSlot.deleteOne({ date, time })
    }

    res.json({ message: 'Slot updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to update slot' })
  }
})

// Contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, preferredChannel } = req.body || {}

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: 'name, email and message are required' })
    }

    const contact = await Contact.create({
      name,
      email,
      phone: phone || '',
      preferredChannel: preferredChannel || 'email',
      message,
    })

    res.status(201).json({
      message: 'Thank you for reaching out. We will contact you shortly.',
      contact,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to submit contact form' })
  }
})

// Corporate enquiry
app.post('/api/corporate', async (req, res) => {
  try {
    const {
      organizationName,
      contactPerson,
      email,
      phone,
      requirements,
      groupSize,
    } = req.body || {}

    if (!organizationName || !contactPerson || !email) {
      return res.status(400).json({
        message: 'organizationName, contactPerson and email are required',
      })
    }

    const corporateRequest = await CorporateRequest.create({
      organizationName,
      contactPerson,
      email,
      phone: phone || '',
      requirements: requirements || '',
      groupSize: groupSize || '',
    })

    res.status(201).json({
      message:
        'Your corporate enquiry has been received. MindSettler will connect with you.',
      corporateRequest,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to submit corporate enquiry' })
  }
})

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 MindSettler backend running on port ${PORT}`)
})

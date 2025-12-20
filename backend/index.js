const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { v4: uuidv4 } = require('uuid')
const { readData, writeData } = require('./config/db')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Basic config
app.use(express.json())
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  }),
)

// Utility: basic slot config controlled on backend
const DAILY_SLOTS = [
  '08:00',
  '10:00',
  '12:00',
  '14:00',
  '16:00',
  '18:00',
]

function getAvailableSlots(date) {
  const data = readData()
  const disabledForDate = data.disabledSlots[date] || []
  const takenSlots = new Set(
    data.bookings
      .filter(
        (b) =>
          b.date === date &&
          (b.status === 'pending' || b.status === 'confirmed'),
      )
      .map((b) => b.time),
  )

  return DAILY_SLOTS.map((time) => ({
    time,
    isAvailable: !takenSlots.has(time) && !disabledForDate.includes(time),
  }))
}

// ROUTES
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'MindSettler backend' })
})

// Get slots for a specific date
app.get('/api/slots', (req, res) => {
  const { date } = req.query
  if (!date) {
    return res.status(400).json({ message: 'date query param is required (YYYY-MM-DD)' })
  }
  const slots = getAvailableSlots(date)
  res.json({ date, slots })
})

// Create a new booking (appointment)
app.post('/api/bookings', (req, res) => {
  const {
    name,
    email,
    phone,
    mode, // online | offline
    sessionType,
    isFirstSession,
    date,
    time,
    notes,
  } = req.body || {}

  if (!name || !email || !date || !time) {
    return res.status(400).json({ message: 'name, email, date and time are required' })
  }

  const data = readData()
  const existingSlots = getAvailableSlots(date)
  const selectedSlot = existingSlots.find((s) => s.time === time)
  if (!selectedSlot || !selectedSlot.isAvailable) {
    return res.status(400).json({ message: 'Selected slot is no longer available' })
  }

  const booking = {
    id: uuidv4(),
    name,
    email,
    phone: phone || '',
    mode: mode || 'online',
    sessionType: sessionType || 'individual',
    isFirstSession: Boolean(isFirstSession),
    date,
    time,
    notes: notes || '',
    status: 'pending', // pending | confirmed | rejected
    createdAt: new Date().toISOString(),
  }

  data.bookings.push(booking)
  writeData(data)

  res.status(201).json({
    message: 'Booking request received. You will be contacted for confirmation.',
    booking,
  })
})

// List bookings (basic admin usage)
app.get('/api/bookings', (_req, res) => {
  const data = readData()
  res.json({ bookings: data.bookings })
})

// Update booking status (admin)
app.patch('/api/bookings/:id/status', (req, res) => {
  const { id } = req.params
  const { status } = req.body || {}
  if (!['pending', 'confirmed', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' })
  }

  const data = readData()
  const booking = data.bookings.find((b) => b.id === id)
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' })
  }

  booking.status = status
  booking.updatedAt = new Date().toISOString()
  writeData(data)

  res.json({ message: 'Status updated', booking })
})

// Disable or enable a time slot for a specific date (admin)
app.post('/api/slots/disable', (req, res) => {
  const { date, time, disabled } = req.body || {}
  if (!date || !time) {
    return res.status(400).json({ message: 'date and time are required' })
  }

  const data = readData()
  if (!data.disabledSlots[date]) {
    data.disabledSlots[date] = []
  }

  if (disabled) {
    if (!data.disabledSlots[date].includes(time)) {
      data.disabledSlots[date].push(time)
    }
  } else {
    data.disabledSlots[date] = data.disabledSlots[date].filter((t) => t !== time)
  }

  writeData(data)
  res.json({ message: 'Slot updated', disabledSlots: data.disabledSlots })
})

// Contact form submissions
app.post('/api/contact', (req, res) => {
  const { name, email, phone, message, preferredChannel } = req.body || {}
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'name, email and message are required' })
  }

  const data = readData()
  const contact = {
    id: uuidv4(),
    name,
    email,
    phone: phone || '',
    preferredChannel: preferredChannel || 'email',
    message,
    createdAt: new Date().toISOString(),
  }
  data.contacts.push(contact)
  writeData(data)

  res.status(201).json({ message: 'Thank you for reaching out. We will contact you shortly.', contact })
})

// Corporate services enquiry
app.post('/api/corporate', (req, res) => {
  const { organizationName, contactPerson, email, phone, requirements, groupSize } = req.body || {}

  if (!organizationName || !contactPerson || !email) {
    return res
      .status(400)
      .json({ message: 'organizationName, contactPerson and email are required' })
  }

  const data = readData()
  const corporateRequest = {
    id: uuidv4(),
    organizationName,
    contactPerson,
    email,
    phone: phone || '',
    requirements: requirements || '',
    groupSize: groupSize || '',
    createdAt: new Date().toISOString(),
  }
  data.corporateRequests.push(corporateRequest)
  writeData(data)

  res.status(201).json({
    message:
      'Your corporate enquiry has been received. MindSettler will connect with you to design a suitable workshop or program.',
    corporateRequest,
  })
})

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`MindSettler backend is running on port ${PORT}`)
})
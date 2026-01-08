const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const { GoogleGenerativeAI } = require('@google/generative-ai')

// Models
const Booking = require('./models/Booking')
const DisabledSlot = require('./models/DisabledSlot')
const Contact = require('./models/Contact')
const CorporateRequest = require('./models/CorporateRequest')
const User = require('./models/User')

// Middleware
const firebaseAuth = require('./middleware/firebaseAuth')

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

// Initialize Gemini AI (force v1 to avoid v1beta 404s)
const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  apiVersion: 'v1',
})

// Middleware
app.use(express.json())
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  }),
)

// ================= SIMPLE ADMIN AUTH (STATIC) =================
// NOTE: This is a very basic, hard-coded admin login as requested.
// Username: admin, Password: asdfghjkl123
// It returns a static token that the frontend can store and use.

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'asdfghjkl123'
const ADMIN_TOKEN = 'mindsettler-admin-static-token'

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {}

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({ token: ADMIN_TOKEN })
  }

  return res.status(401).json({ message: 'Invalid credentials' })
})

// Optional simple middleware for any future protected admin routes
function requireAdmin(req, res, next) {
  const auth = req.headers['authorization'] || ''
  const token = auth.replace('Bearer ', '')

  if (token === ADMIN_TOKEN) {
    return next()
  }

  return res.status(401).json({ message: 'Unauthorized' })
}

// Fixed daily slots
const DAILY_SLOTS = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00']

function isPastDate(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [year, month, day] = dateStr.split('-').map(Number)
  const candidate = new Date(year, month - 1, day)
  candidate.setHours(0, 0, 0, 0)
  return candidate < today
}

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

// Authenticated route: returns Firebase user + Mongo user document
app.get('/api/me', firebaseAuth, (req, res) => {
  res.json({
    firebaseUser: req.firebaseUser,
    user: req.user,
    provider: req.authProvider,
  })
})

// Update authenticated user's profile (username, name, phone)
app.patch('/api/me', firebaseAuth, async (req, res) => {
  try {
    const { username, name, phone } = req.body || {}

    if (!username && !name && !phone) {
      return res.status(400).json({ message: 'At least one of username, name or phone is required' })
    }

    const updates = {}
    if (username) updates.username = username.toLowerCase()
    if (name) updates.name = name
    if (phone !== undefined) updates.phone = phone
    updates.onboardingCompleted = true

    let user = await User.findOneAndUpdate(
      { firebaseUID: req.firebaseUser.uid },
      { $set: updates },
      { new: true },
    )

    if (!user) {
      // In rare cases if user doc does not exist, create it now
      user = await User.create({
        username: updates.username || req.firebaseUser.email.split('@')[0],
        name: updates.name || req.firebaseUser.name || 'User',
        email: req.firebaseUser.email,
        firebaseUID: req.firebaseUser.uid,
        phone: updates.phone || req.firebaseUser.phone_number || '',
        onboardingCompleted: true,
      })
    }

    return res.json({ user })
  } catch (err) {
    console.error('Failed to update profile', err)

    // Handle duplicate username/email errors
    if (err.code === 11000) {
      if (err.keyPattern && err.keyPattern.username) {
        return res.status(409).json({ message: 'Username is already taken' })
      }
      if (err.keyPattern && err.keyPattern.email) {
        return res.status(409).json({ message: 'Email is already in use' })
      }
    }

    return res.status(500).json({ message: 'Failed to update profile' })
  }
})

// Resolve username or email to a login email for client-side auth
app.get('/api/auth/resolve-username', async (req, res) => {
  try {
    const { identifier } = req.query

    if (!identifier) {
      return res.status(400).json({ message: 'identifier query param is required' })
    }

    const lowered = String(identifier).toLowerCase().trim()

    let user = await User.findOne({ username: lowered })

    // If not found by username but looks like an email, try email lookup
    if (!user && lowered.includes('@')) {
      user = await User.findOne({ email: lowered })
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({ email: user.email })
  } catch (err) {
    console.error('Failed to resolve username', err)
    return res.status(500).json({ message: 'Failed to resolve username' })
  }
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

    if (isPastDate(date)) {
      return res.status(400).json({ message: 'Cannot fetch slots for a past date' })
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

    if (isPastDate(date)) {
      return res.status(400).json({ message: 'Cannot book a slot in the past' })
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

// List contact submissions (admin)
app.get('/api/contact', async (_req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json({ contacts })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch contacts' })
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

// List corporate enquiries (admin)
app.get('/api/corporate', async (_req, res) => {
  try {
    const corporateRequests = await CorporateRequest.find().sort({ createdAt: -1 })
    res.json({ corporateRequests })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch corporate enquiries' })
  }
})

// ================= CHATBOT ENDPOINT =================
app.post('/api/chatbot', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body

    if (!message) {
      return res.status(400).json({ message: 'Message is required' })
    }

    // System prompt with context about MindSettler
    const systemPrompt = `You are a helpful assistant for MindSettler, a mental health and wellness platform. 
    
About MindSettler:
- MindSettler provides psychological counseling and therapy services
- We offer individual counseling sessions, psycho-education, and corporate wellness programs
- Our services include stress management, anxiety treatment, relationship counseling, and more
- We have experienced psychologists and counselors
- Booking slots are available from 8:00 AM to 6:00 PM
- Sessions can be booked online through our website

Your role:
- Answer questions about mental health services, booking process, and wellness
- Be empathetic, professional, and supportive
- Provide helpful information about our services
- Guide users on how to book appointments or contact us
- If asked about emergencies, advise them to contact emergency services or our helpline
- Keep responses concise but informative (2-3 sentences usually)

Important: You provide general information and support, but you are not a substitute for professional mental health care.`

    // Initialize the model (v1 models use -latest names)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' })

    // Build conversation context
    let prompt = systemPrompt + '\n\n'
    
    // Add conversation history
    if (conversationHistory.length > 0) {
      prompt += 'Previous conversation:\n'
      conversationHistory.slice(-6).forEach((msg) => {
        prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`
      })
      prompt += '\n'
    }

    prompt += `User: ${message}\nAssistant:`

    // Generate response
    const result = await model.generateContent(prompt)
    const response = await result.response
    const botReply = response.text()

    res.json({ reply: botReply })
  } catch (err) {
    console.error('Chatbot error:', err)
    res.status(500).json({ 
      message: 'Sorry, I encountered an error. Please try again.',
      error: err.message 
    })
  }
})

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 MindSettler backend running on port ${PORT}`)
})

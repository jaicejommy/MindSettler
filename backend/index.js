const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const multer = require('multer')
const connectDB = require('./config/db')
const { GoogleGenAI } = require('@google/genai')

// Models
const Booking = require('./models/Booking')
const DisabledSlot = require('./models/DisabledSlot')
const Contact = require('./models/Contact')
const CorporateRequest = require('./models/CorporateRequest')
const User = require('./models/User')
const Admin = require('./models/Admin')

// Services
const { sendPasswordResetEmail } = require('./services/emailService')

// Middleware
const firebaseAuth = require('./middleware/firebaseAuth')
const firebaseAdminAuth = require('./middleware/firebaseAdminAuth')

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

// File uploads: profile pictures
const uploadsDir = path.join(__dirname, 'uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.jpg'
    const uid = (req.firebaseUser && req.firebaseUser.uid) || 'anonymous'
    cb(null, `profile-${uid}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed'))
    }
    return cb(null, true)
  },
})

// Payment screenshot storage
const paymentStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.jpg'
    const timestamp = Date.now()
    cb(null, `payment-${timestamp}${ext}`)
  },
})

const paymentUpload = multer({
  storage: paymentStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed'))
    }
    return cb(null, true)
  },
})

// Initialize Gemini AI
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// Middleware
app.use(express.json())
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, curl)
      if (!origin) return callback(null, true)

      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
      ]

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

// Serve uploaded profile images
app.use('/uploads', express.static(uploadsDir))

// ================= ADMIN AUTH =================
// Admin credentials stored in database with hashed passwords
// Default admin will be created on first run if none exists

const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'mindsettler-admin-secret-key'

// Generate a simple token for admin session
function generateAdminToken(adminId) {
  const payload = `${adminId}:${Date.now()}`
  return Buffer.from(payload).toString('base64')
}

// Verify admin token
function verifyAdminToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const [adminId] = decoded.split(':')
    return adminId
  } catch {
    return null
  }
}

// Initialize default admin if none exists
async function initializeDefaultAdmin() {
  try {
    const adminCount = await Admin.countDocuments()
    if (adminCount === 0) {
      await Admin.create({
        username: 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@mindsettler.com',
        password: 'asdfghjkl123',
      })
      console.log('✅ Default admin created (username: admin, password: asdfghjkl123)')
    }
  } catch (err) {
    console.error('Failed to initialize default admin:', err.message)
  }
}

// Call after DB connection
setTimeout(initializeDefaultAdmin, 2000)

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body || {}

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    const admin = await Admin.findOne({ username: username.toLowerCase() })

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await admin.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = generateAdminToken(admin._id.toString())
    return res.json({ token, admin: { username: admin.username, email: admin.email } })
  } catch (err) {
    console.error('Admin login failed:', err)
    return res.status(500).json({ message: 'Login failed' })
  }
})

// Admin forgot password (Custom Email Flow)
app.post('/api/admin/forgot-password', async (req, res) => {
  try {
    const { email } = req.body || {}

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    // Verify user exists in Firebase (optional but good for debugging)
    try {
      await admin.auth().getUserByEmail(email)
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        // Return success to prevent enumeration, or error depending on policy
        // User asked for "Stylish Email", implies they want it to work. 
        // We'll return success message but log it.
        console.log('Forgot Password: User not found in Firebase')
        return res.json({ message: 'If an account with this email exists, a reset link has been sent.' })
      }
      throw err
    }

    const actionCodeSettings = {
      url: `${process.env.ADMIN_FRONTEND_URL || 'http://localhost:5174'}/reset-password`,
      handleCodeInApp: false,
    }

    const resetLink = await admin.auth().generatePasswordResetLink(email, actionCodeSettings)

    // Send stylish email
    await sendPasswordResetEmail(email, resetLink, 'Admin', true)

    return res.json({ message: 'If an account with this email exists, a reset link has been sent.' })
  } catch (err) {
    console.error('Forgot password failed:', err)
    return res.status(500).json({ message: 'Failed to process request' })
  }
})

// Admin reset password
app.post('/api/admin/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body || {}

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    const admin = await Admin.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    })

    if (!admin) {
      console.log('Reset Password Failed: Token invalid or expired')
      console.log('Received Token:', token)
      console.log('Current Time:', new Date())
      // Check if token exists at all without expiry check for debugging
      const debugAdmin = await Admin.findOne({ resetToken: token })
      if (debugAdmin) {
        console.log('Token exists but expired/mismatch. Expiry:', debugAdmin.resetTokenExpiry)
      } else {
        console.log('Token not found in DB')
      }
      return res.status(400).json({ message: 'Invalid or expired reset token' })
    }

    admin.password = newPassword
    admin.resetToken = undefined
    admin.resetTokenExpiry = undefined
    await admin.save()

    return res.json({ message: 'Password reset successful. You can now login with your new password.' })
  } catch (err) {
    console.error('Reset password failed:', err)
    return res.status(500).json({ message: 'Failed to reset password' })
  }
})

// Admin change password (when logged in)
app.post('/api/admin/change-password', async (req, res) => {
  try {
    const auth = req.headers['authorization'] || ''
    const token = auth.replace('Bearer ', '')
    const adminId = verifyAdminToken(token)

    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { currentPassword, newPassword } = req.body || {}

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' })
    }

    const admin = await Admin.findById(adminId)

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    const isMatch = await admin.comparePassword(currentPassword)

    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }

    admin.password = newPassword
    await admin.save()

    return res.json({ message: 'Password changed successfully' })
  } catch (err) {
    console.error('Change password failed:', err)
    return res.status(500).json({ message: 'Failed to change password' })
  }
})

// Middleware to require admin authentication
function requireAdmin(req, res, next) {
  const auth = req.headers['authorization'] || ''
  const token = auth.replace('Bearer ', '')
  const adminId = verifyAdminToken(token)

  if (adminId) {
    req.adminId = adminId
    return next()
  }

  return res.status(401).json({ message: 'Unauthorized' })
}

// ================= USER PASSWORD RESET =================

// User forgot password (for email/password users)
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body || {}

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      // Don't reveal if email exists
      return res.json({ message: 'If an account with this email exists, a reset link has been sent.' })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    user.resetToken = resetToken
    user.resetTokenExpiry = resetTokenExpiry
    await user.save()

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`

    await sendPasswordResetEmail(user.email, resetUrl, user.name || user.username, false)

    return res.json({ message: 'If an account with this email exists, a reset link has been sent.' })
  } catch (err) {
    console.error('User forgot password failed:', err)
    return res.status(500).json({ message: 'Failed to process request' })
  }
})

// User reset password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body || {}

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' })
    }

    user.password = newPassword
    user.resetToken = undefined
    user.resetTokenExpiry = undefined
    await user.save()

    return res.json({ message: 'Password reset successful. You can now login with your new password.' })
  } catch (err) {
    console.error('User reset password failed:', err)
    return res.status(500).json({ message: 'Failed to reset password' })
  }
})


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
  if (!req.user) {
    return res.status(404).json({ message: 'User not found' })
  }
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
    console.error('Failed to update profile:', err.message)
    console.error(err.stack)

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

// Upload or update authenticated user's profile picture
app.post('/api/me/profile-pic', firebaseAuth, upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' })
    }

    const relativePath = `/uploads/${path.basename(req.file.path)}`

    let user = await User.findOneAndUpdate(
      { firebaseUID: req.firebaseUser.uid },
      { $set: { profilePic: relativePath, onboardingCompleted: true } },
      { new: true },
    )

    if (!user) {
      const usernameBase = req.firebaseUser.email
        ? req.firebaseUser.email.split('@')[0]
        : `user_${req.firebaseUser.uid.slice(0, 8)}`

      user = await User.create({
        username: usernameBase,
        name: req.firebaseUser.name || usernameBase,
        email: req.firebaseUser.email,
        firebaseUID: req.firebaseUser.uid,
        phone: req.firebaseUser.phone_number || '',
        profilePic: relativePath,
        onboardingCompleted: true,
      })
    }

    return res.json({ user })
  } catch (err) {
    console.error('Failed to update profile picture', err)
    return res.status(500).json({ message: 'Failed to update profile picture' })
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

// Get authenticated user's bookings history
app.get('/api/me/bookings', firebaseAuth, async (req, res) => {
  try {
    const email = (req.user && req.user.email) || (req.firebaseUser && req.firebaseUser.email)

    if (!email) {
      return res.status(400).json({ message: 'No email associated with this user' })
    }

    const bookings = await Booking.find({ email }).sort({ date: -1, time: -1 })
    return res.json({ bookings })
  } catch (err) {
    console.error('Failed to fetch user bookings', err)
    return res.status(500).json({ message: 'Failed to fetch user bookings' })
  }
})

// Create booking
app.post('/api/bookings', firebaseAuth, paymentUpload.single('paymentScreenshot'), async (req, res) => {
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
      paymentScreenshot: req.file ? `/uploads/${path.basename(req.file.path)}` : '',
      paymentStatus: 'pending',
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
app.get('/api/bookings', firebaseAdminAuth, async (_req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 })
    res.json({ bookings })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch bookings' })
  }
})

// Update booking status (admin)
app.patch('/api/bookings/:id/status', firebaseAdminAuth, async (req, res) => {
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
app.post('/api/slots/disable', firebaseAdminAuth, async (req, res) => {
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
app.get('/api/contact', firebaseAdminAuth, async (_req, res) => {
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
app.get('/api/corporate', firebaseAdminAuth, async (_req, res) => {
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

IMPORTANT - Website Pages (provide these links when relevant):
- Home Page: /
- Book an Appointment: /booking (ALWAYS provide this link when user wants to book, schedule, or make an appointment)
- About Us: /about (provide when user asks about the company, team, or therapists)
- Contact Us: /contact (provide when user wants to get in touch, call, or email)
- Psycho-Education: /psycho-education (provide when user asks about educational resources or learning about mental health)
- Our Journey: /journey (provide when user asks about company history)
- Corporate Wellness: /corporate (provide when user asks about services for companies or organizations)
- FAQs: /faqs (provide when user has common questions or needs help)
- Privacy Policy: /privacy
- Confidentiality: /confidentiality
- Login/Register: /auth (provide when user wants to create account or sign in)

Your role:
- Answer questions about mental health services, booking process, and wellness
- Be empathetic, professional, and supportive
- ALWAYS provide relevant page links when users ask about actions (booking, contact, services, etc.)
- Format links like this: "You can book an appointment here: /booking" or "Visit our booking page at /booking"
- Guide users on how to book appointments or contact us
- If asked about emergencies, advise them to contact emergency services immediately
- Keep responses concise but informative (2-3 sentences usually)

Important: You provide general information and support, but you are not a substitute for professional mental health care.`

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

    // Generate response using new SDK
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })
    const botReply = response.text

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

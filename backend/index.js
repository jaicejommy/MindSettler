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
const Message = require('./models/Message')
const SessionPrice = require('./models/SessionPrice')
const Coupon = require('./models/Coupon')
const Article = require('./models/Article')

// Services
const { sendPasswordResetEmail, sendBookingConfirmationEmail, sendBookingRejectionEmail, sendWelcomeEmail } = require('./services/emailService')
const { sendRescheduleEmail } = require('./services/rescheduleEmail')

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

// Session categories used across booking & admin
const SESSION_TYPES = [
  { id: 'cbt', label: 'Cognitive Behavioural Therapy (CBT)' },
  { id: 'dbt', label: 'Dialectical Behavioural Therapy (DBT)' },
  { id: 'act', label: 'Acceptance & Commitment Therapy (ACT)' },
  { id: 'schema', label: 'Schema Therapy' },
  { id: 'eft', label: 'Emotion-Focused Therapy (EFT)' },
  { id: 'efct', label: 'Emotion-Focused Couples Therapy' },
  { id: 'mbct', label: 'Mindfulness-Based Cognitive Therapy' },
  { id: 'cct', label: 'Client-Centred Therapy' },
]

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

// Ensure pricing records exist for all session categories
async function ensureDefaultSessionPrices() {
  try {
    await Promise.all(
      SESSION_TYPES.map(async ({ id, label }) => {
        await SessionPrice.findOneAndUpdate(
          { sessionType: id },
          { $setOnInsert: { sessionType: id, label, price: 0 } },
          { upsert: true, new: true },
        )
      }),
    )
  } catch (err) {
    console.error('Failed to seed session prices:', err.message)
  }
}

async function getSessionPriceValue(sessionType) {
  const record = await SessionPrice.findOne({ sessionType })
  return record ? record.price : 0
}

// Seed default prices after DB connection
setTimeout(ensureDefaultSessionPrices, 2500)

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

      // Send welcome email to new user (don't await to avoid blocking response)
      sendWelcomeEmail(user.email, user.name).catch(err => {
        console.error('Failed to send welcome email:', err.message)
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

      // Send welcome email to new user (don't await to avoid blocking response)
      sendWelcomeEmail(user.email, user.name).catch(err => {
        console.error('Failed to send welcome email:', err.message)
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

// Session pricing (public fetch)
app.get('/api/pricing', async (_req, res) => {
  try {
    await ensureDefaultSessionPrices()
    const prices = await SessionPrice.find().sort({ label: 1 })
    res.json({ prices, sessionTypes: SESSION_TYPES })
  } catch (err) {
    console.error('Failed to fetch pricing', err)
    res.status(500).json({ message: 'Failed to fetch pricing' })
  }
})

// Update pricing (admin)
app.put('/api/pricing', requireAdmin, async (req, res) => {
  try {
    const { prices } = req.body || {}

    if (!Array.isArray(prices)) {
      return res.status(400).json({ message: 'prices array is required' })
    }

    const upserts = prices.map((p) => {
      const sessionType = String(p.sessionType || '').trim()
      const priceValue = Number(p.price || 0)
      const label = p.label || SESSION_TYPES.find((s) => s.id === sessionType)?.label || sessionType

      if (!sessionType) return null

      return SessionPrice.findOneAndUpdate(
        { sessionType },
        { sessionType, label, price: priceValue, isActive: p.isActive !== false },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      )
    }).filter(Boolean)

    const updated = await Promise.all(upserts)
    res.json({ message: 'Pricing updated', prices: updated })
  } catch (err) {
    console.error('Failed to update pricing', err)
    res.status(500).json({ message: 'Failed to update pricing' })
  }
})

// Coupon creation/listing (admin)
app.get('/api/coupons', requireAdmin, async (_req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 })
    res.json({ coupons })
  } catch (err) {
    console.error('Failed to list coupons', err)
    res.status(500).json({ message: 'Failed to fetch coupons' })
  }
})

app.post('/api/coupons', requireAdmin, async (req, res) => {
  try {
    const { code, discountAmount, isPercentage = false, description = '', expiresAt = null, maxRedemptions = 0, isActive = true } = req.body || {}

    if (!code || discountAmount === undefined) {
      return res.status(400).json({ message: 'code and discountAmount are required' })
    }

    const normalizedCode = String(code).trim()
    const coupon = await Coupon.findOneAndUpdate(
      { code: normalizedCode },
      {
        code: normalizedCode,
        discountAmount: Number(discountAmount),
        isPercentage: Boolean(isPercentage),
        description,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxRedemptions: Number(maxRedemptions) || 0,
        isActive: Boolean(isActive),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )

    res.status(201).json({ message: 'Coupon saved', coupon })
  } catch (err) {
    console.error('Failed to save coupon', err)
    res.status(500).json({ message: 'Failed to save coupon' })
  }
})

// Delete coupon (admin)
app.delete('/api/coupons/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const coupon = await Coupon.findByIdAndDelete(id)

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' })
    }

    res.json({ message: 'Coupon deleted successfully', coupon })
  } catch (err) {
    console.error('Failed to delete coupon', err)
    res.status(500).json({ message: 'Failed to delete coupon' })
  }
})

// Coupon validation (client)
app.post('/api/coupons/validate', async (req, res) => {
  try {
    const { code } = req.body || {}
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' })
    }

    const normalizedCode = String(code).trim()
    const coupon = await Coupon.findOne({ code: normalizedCode })

    if (!coupon || !coupon.isValid()) {
      return res.json({ valid: false })
    }

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountAmount: coupon.discountAmount,
        isPercentage: coupon.isPercentage,
      },
    })
  } catch (err) {
    console.error('Failed to validate coupon', err)
    res.status(500).json({ message: 'Failed to validate coupon' })
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

// Get authenticated user's messages
app.get('/api/me/messages', firebaseAuth, async (req, res) => {
  try {
    const email = (req.user && req.user.email) || (req.firebaseUser && req.firebaseUser.email)

    if (!email) {
      return res.status(400).json({ message: 'No email associated with this user' })
    }

    const messages = await Message.find({ email: email.toLowerCase() })
      .sort({ createdAt: -1 })
      .limit(50)

    const unreadCount = await Message.countDocuments({
      email: email.toLowerCase(),
      isRead: false
    })

    return res.json({ messages, unreadCount })
  } catch (err) {
    console.error('Failed to fetch user messages', err)
    return res.status(500).json({ message: 'Failed to fetch user messages' })
  }
})

// Mark a message as read
app.patch('/api/me/messages/:id/read', firebaseAuth, async (req, res) => {
  try {
    const { id } = req.params
    const email = (req.user && req.user.email) || (req.firebaseUser && req.firebaseUser.email)

    if (!email) {
      return res.status(400).json({ message: 'No email associated with this user' })
    }

    const message = await Message.findOneAndUpdate(
      { _id: id, email: email.toLowerCase() },
      { isRead: true },
      { new: true }
    )

    if (!message) {
      return res.status(404).json({ message: 'Message not found' })
    }

    return res.json({ message })
  } catch (err) {
    console.error('Failed to mark message as read', err)
    return res.status(500).json({ message: 'Failed to update message' })
  }
})

// Mark all messages as read
app.patch('/api/me/messages/read-all', firebaseAuth, async (req, res) => {
  try {
    const email = (req.user && req.user.email) || (req.firebaseUser && req.firebaseUser.email)

    if (!email) {
      return res.status(400).json({ message: 'No email associated with this user' })
    }

    await Message.updateMany(
      { email: email.toLowerCase(), isRead: false },
      { isRead: true }
    )

    return res.json({ message: 'All messages marked as read' })
  } catch (err) {
    console.error('Failed to mark all messages as read', err)
    return res.status(500).json({ message: 'Failed to update messages' })
  }
})

// Create booking
app.post('/api/bookings', firebaseAuth, paymentUpload.single('paymentScreenshot'), async (req, res) => {
  try {
    const {
      name,
      phone,
      mode,
      sessionType,
      isFirstSession,
      date,
      time,
      notes,
      couponCode,
      reviewDetails,
    } = req.body || {}

    // Get email from authenticated user
    const email = req.user?.email

    if (!name || !email || !date || !time) {
      return res
        .status(400)
        .json({ message: 'name, date and time are required' })
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

    const sessionPrice = await getSessionPriceValue(sessionType || SESSION_TYPES[0].id)
    let discountAmount = 0
    let appliedCouponCode = ''

    if (couponCode) {
      const normalizedCode = String(couponCode).trim()
      const coupon = await Coupon.findOne({ code: normalizedCode })

      if (!coupon || !coupon.isValid()) {
        return res.status(400).json({ message: 'Invalid or expired coupon code' })
      }

      discountAmount = coupon.isPercentage
        ? Math.round((sessionPrice * coupon.discountAmount) / 100)
        : coupon.discountAmount
      appliedCouponCode = coupon.code

      coupon.redeemedCount += 1
      await coupon.save()
    }

    const totalAmount = Math.max(sessionPrice - discountAmount, 0)

    const booking = await Booking.create({
      name,
      email,
      phone: phone || '',
      mode: mode || 'online',
      sessionType: sessionType || 'individual',
      sessionPrice,
      discountAmount,
      totalAmount,
      couponCode: appliedCouponCode,
      isFirstSession: Boolean(isFirstSession),
      date,
      time,
      notes: notes || '',
      reviewDetails: reviewDetails || '',
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
    const { status, reason } = req.body || {}

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

    // Send confirmation email if status is confirmed
    if (status === 'confirmed' && booking.email) {
      try {
        await sendBookingConfirmationEmail(booking.email, booking)
      } catch (emailErr) {
        console.error('Failed to send confirmation email:', emailErr)
      }

      // Create in-app message for confirmation
      try {
        const user = await User.findOne({ email: booking.email.toLowerCase() })
        await Message.create({
          email: booking.email.toLowerCase(),
          firebaseUID: user?.firebaseUID || null,
          type: 'booking_confirmed',
          title: 'Session Confirmed! 🎉',
          content: `Great news! Your counseling session on ${booking.date} at ${booking.time} has been confirmed. We look forward to seeing you!`,
          bookingId: booking._id,
          metadata: {
            date: booking.date,
            time: booking.time,
            mode: booking.mode,
            sessionType: booking.sessionType,
          },
        })
      } catch (msgErr) {
        console.error('Failed to create confirmation message:', msgErr)
      }
    }

    // Send rejection email if status is rejected
    if (status === 'rejected' && booking.email) {
      try {
        await sendBookingRejectionEmail(booking.email, booking, reason)
      } catch (emailErr) {
        console.error('Failed to send rejection email:', emailErr)
      }

      // Create in-app message for rejection
      try {
        const user = await User.findOne({ email: booking.email.toLowerCase() })
        await Message.create({
          email: booking.email.toLowerCase(),
          firebaseUID: user?.firebaseUID || null,
          type: 'booking_rejected',
          title: 'Session Update',
          content: `We regret to inform you that your session request for ${booking.date} at ${booking.time} could not be confirmed.${reason ? ` Reason: ${reason}` : ''} Please feel free to book another slot.`,
          bookingId: booking._id,
          metadata: {
            date: booking.date,
            time: booking.time,
            reason: reason || '',
          },
        })
      } catch (msgErr) {
        console.error('Failed to create rejection message:', msgErr)
      }
    }

    res.json({ message: 'Status updated', booking })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to update status' })
  }
})

// Reschedule booking (admin)
app.post('/api/bookings/:id/reschedule', firebaseAdminAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { newDate, newTime, message: adminMessage } = req.body || {}

    if (!newDate || !newTime) {
      return res.status(400).json({ message: 'newDate and newTime are required' })
    }

    const booking = await Booking.findById(id)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    const originalDate = booking.date
    const originalTime = booking.time

    // Update the booking with new date/time
    booking.date = newDate
    booking.time = newTime
    booking.status = 'confirmed'
    await booking.save()

    // Send reschedule email
    if (booking.email) {
      try {
        await sendRescheduleEmail(booking.email, {
          name: booking.name,
          date: originalDate,
          time: originalTime
        }, newDate, newTime, adminMessage)
      } catch (emailErr) {
        console.error('Failed to send reschedule email:', emailErr)
      }

      // Create in-app message for reschedule
      try {
        const user = await User.findOne({ email: booking.email.toLowerCase() })
        await Message.create({
          email: booking.email.toLowerCase(),
          firebaseUID: user?.firebaseUID || null,
          type: 'booking_rescheduled',
          title: 'Session Rescheduled 📅',
          content: `Your session has been rescheduled from ${originalDate} at ${originalTime} to ${newDate} at ${newTime}.${adminMessage ? ` Message from MindSettler: "${adminMessage}"` : ''} Please note the new timing.`,
          bookingId: booking._id,
          metadata: {
            originalDate,
            originalTime,
            newDate,
            newTime,
            adminMessage: adminMessage || '',
          },
        })
      } catch (msgErr) {
        console.error('Failed to create reschedule message:', msgErr)
      }
    }

    res.json({ message: 'Booking rescheduled', booking })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to reschedule booking' })
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

// ================= PRICING API =================
// Get session prices
app.get('/api/pricing', async (_req, res) => {
  try {
    let prices = await SessionPrice.find({})

    // If no prices in DB, return defaults based on SESSION_TYPES
    if (prices.length === 0) {
      prices = SESSION_TYPES.map((t) => ({
        sessionType: t.id,
        label: t.label,
        price: 0,
        currency: 'INR',
        isActive: true,
      }))
    } else {
      // Merge with any new types in SESSION_TYPES that might not be in DB yet
      // This ensures we always return the full list known to the system
      const dbTypes = new Set(prices.map(p => p.sessionType))

      SESSION_TYPES.forEach(t => {
        if (!dbTypes.has(t.id)) {
          prices.push({
            sessionType: t.id,
            label: t.label,
            price: 0,
            currency: 'INR',
            isActive: true,
          })
        }
      })
    }

    // Sort to match SESSION_TYPES order
    const typeOrder = SESSION_TYPES.map(t => t.id)
    prices.sort((a, b) => typeOrder.indexOf(a.sessionType) - typeOrder.indexOf(b.sessionType))

    res.json({ prices })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch pricing' })
  }
})

// Update session prices (admin only)
app.put('/api/pricing', firebaseAdminAuth, async (req, res) => {
  try {
    const { prices } = req.body
    if (!Array.isArray(prices)) {
      return res.status(400).json({ message: 'prices must be an array' })
    }

    const updatedPrices = []

    // Bulk upsert
    for (const p of prices) {
      const updated = await SessionPrice.findOneAndUpdate(
        { sessionType: p.sessionType },
        {
          label: p.label,
          price: p.price,
          currency: p.currency || 'INR',
          isActive: p.isActive !== undefined ? p.isActive : true
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
      updatedPrices.push(updated)
    }

    // Sort again before returning
    const typeOrder = SESSION_TYPES.map(t => t.id)
    updatedPrices.sort((a, b) => typeOrder.indexOf(a.sessionType) - typeOrder.indexOf(b.sessionType))

    res.json({ message: 'Pricing updated', prices: updatedPrices })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to update pricing' })
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

// ================= QR CODE MANAGEMENT =================
// QR code storage
const qrStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.png'
    cb(null, `payment-qr${ext}`)
  },
})

const qrUpload = multer({
  storage: qrStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed'))
    }
    return cb(null, true)
  },
})

// Get current QR code
app.get('/api/settings/qr', (req, res) => {
  const possibleExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp']
  let qrFile = null

  for (const ext of possibleExtensions) {
    const filePath = path.join(uploadsDir, `payment-qr${ext}`)
    if (fs.existsSync(filePath)) {
      qrFile = `payment-qr${ext}`
      break
    }
  }

  if (qrFile) {
    res.json({ qrUrl: `/uploads/${qrFile}?t=${Date.now()}` })
  } else {
    res.json({ qrUrl: null })
  }
})

// Upload new QR code (admin only)
app.post('/api/settings/qr', (req, res) => {
  // Verify admin token
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]
  const adminId = verifyAdminToken(token)

  if (!adminId) {
    return res.status(401).json({ message: 'Invalid admin token' })
  }

  // Delete existing QR files before upload
  const possibleExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp']
  for (const ext of possibleExtensions) {
    const filePath = path.join(uploadsDir, `payment-qr${ext}`)
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath)
      } catch (e) {
        console.error('Failed to delete old QR:', e)
      }
    }
  }

  qrUpload.single('qr')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message })
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    res.json({
      message: 'QR code updated successfully',
      qrUrl: `/uploads/${req.file.filename}?t=${Date.now()}`
    })
  })
})

// ================= ARTICLES API =================

// Get all published articles (public)
app.get('/api/articles', async (req, res) => {
  try {
    const { category, limit = 20, skip = 0 } = req.query

    const query = { isPublished: true }
    if (category && category !== 'all') {
      query.category = category
    }

    const articles = await Article.find(query)
      .select('title slug category coverImage excerpt readTime publishedAt author tags')
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))

    const total = await Article.countDocuments(query)

    res.json({ articles, total })
  } catch (err) {
    console.error('Failed to fetch articles:', err)
    res.status(500).json({ message: 'Failed to fetch articles' })
  }
})

// Get single article by slug (public)
app.get('/api/articles/:slug', async (req, res) => {
  try {
    const { slug } = req.params

    const article = await Article.findOne({ slug, isPublished: true })

    if (!article) {
      return res.status(404).json({ message: 'Article not found' })
    }

    res.json({ article })
  } catch (err) {
    console.error('Failed to fetch article:', err)
    res.status(500).json({ message: 'Failed to fetch article' })
  }
})

// Admin: Get all articles (including drafts)
app.get('/api/admin/articles', requireAdmin, async (req, res) => {
  try {
    const articles = await Article.find()
      .sort({ createdAt: -1 })

    res.json({ articles })
  } catch (err) {
    console.error('Failed to fetch admin articles:', err)
    res.status(500).json({ message: 'Failed to fetch articles' })
  }
})

// Admin: Create article
app.post('/api/admin/articles', requireAdmin, async (req, res) => {
  try {
    const { title, category, coverImage, excerpt, content, isPublished, tags } = req.body || {}

    if (!title || !excerpt || !content) {
      return res.status(400).json({ message: 'Title, excerpt, and content are required' })
    }

    // Generate slug from title
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check for slug uniqueness
    const existingSlug = await Article.findOne({ slug })
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`
    }

    const article = await Article.create({
      title,
      slug,
      category: category || 'article',
      coverImage: coverImage || null,
      excerpt,
      content,
      isPublished: isPublished || false,
      tags: tags || []
    })

    res.status(201).json({ message: 'Article created', article })
  } catch (err) {
    console.error('Failed to create article:', err)
    res.status(500).json({ message: 'Failed to create article' })
  }
})

// Admin: Update article
app.put('/api/admin/articles/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { title, category, coverImage, excerpt, content, isPublished, tags } = req.body || {}

    const article = await Article.findById(id)

    if (!article) {
      return res.status(404).json({ message: 'Article not found' })
    }

    // Update fields
    if (title) article.title = title
    if (category) article.category = category
    if (coverImage !== undefined) article.coverImage = coverImage
    if (excerpt) article.excerpt = excerpt
    if (content) article.content = content
    if (isPublished !== undefined) article.isPublished = isPublished
    if (tags) article.tags = tags

    await article.save()

    res.json({ message: 'Article updated', article })
  } catch (err) {
    console.error('Failed to update article:', err)
    res.status(500).json({ message: 'Failed to update article' })
  }
})

// Admin: Delete article
app.delete('/api/admin/articles/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params

    const article = await Article.findByIdAndDelete(id)

    if (!article) {
      return res.status(404).json({ message: 'Article not found' })
    }

    res.json({ message: 'Article deleted' })
  } catch (err) {
    console.error('Failed to delete article:', err)
    res.status(500).json({ message: 'Failed to delete article' })
  }
})

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 MindSettler backend running on port ${PORT}`)
})

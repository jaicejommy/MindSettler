const admin = require('../firebaseAdmin')
const User = require('../models/User')

async function firebaseAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.replace('Bearer ', '')
      : null

    if (!token) {
      return res.status(401).json({ message: 'No Authorization token provided' })
    }

    const decoded = await admin.auth().verifyIdToken(token)

    // Attach decoded Firebase user to request
    req.firebaseUser = decoded

    // Ensure a corresponding User document exists in MongoDB
    const {
      uid,
      email,
      name,
      picture,
      phone_number,
      firebase = {},
    } = decoded

    const provider = firebase.sign_in_provider || 'password'

    const usernameBase = email ? email.split('@')[0] : `user_${uid.slice(0, 8)}`

    let user = await User.findOne({ firebaseUID: uid })

    if (!user) {
      // Ensure unique username if needed
      let username = usernameBase
      let counter = 1
      // eslint-disable-next-line no-await-in-loop
      while (await User.findOne({ username })) {
        username = `${usernameBase}${counter}`
        counter += 1
      }

      user = await User.create({
        username,
        name: name || usernameBase,
        email: email || `${usernameBase}@placeholder.local`,
        firebaseUID: uid,
        phone: phone_number || '',
        profilePic: picture || '',
        concerns: [],
      })
    }

    req.user = user
    req.authProvider = provider

    return next()
  } catch (err) {
    console.error('Firebase auth error:', err)
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = firebaseAuth

const admin = require('../firebaseAdmin')

const firebaseAdminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No authorization token provided' })
        }

        const token = authHeader.split(' ')[1]

        // Verify token with Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(token)

        // STRICT CHECK: Only allow configured admin email
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@mindsettler.com'

        if (decodedToken.email.toLowerCase() !== adminEmail.toLowerCase()) {
            return res.status(403).json({ message: 'Access denied: Not an administrator' })
        }

        req.adminUser = decodedToken
        next()
    } catch (err) {
        console.error('Firebase Admin Auth Error:', err)
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}

module.exports = firebaseAdminAuth

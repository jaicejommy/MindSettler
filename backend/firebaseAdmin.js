const admin = require('firebase-admin')

// Firebase Admin can be initialized in two ways:
// 1. Production: Using FIREBASE_SERVICE_ACCOUNT environment variable (JSON string)
// 2. Development: Using local serviceAccountKey.json file

let app

try {
  let serviceAccount

  // Check if running in production with env variable
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  } else {
    // Fallback to local file for development
    serviceAccount = require('./serviceAccountKey.json')
  }

  if (!admin.apps.length) {
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  } else {
    app = admin.app()
  }
} catch (err) {
  console.error(
    '\n[Firebase Admin] Failed to initialize. Either set FIREBASE_SERVICE_ACCOUNT env variable or place serviceAccountKey.json in backend folder.',
  )
  throw err
}

module.exports = admin


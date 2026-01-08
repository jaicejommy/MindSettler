const admin = require('firebase-admin')

// IMPORTANT:
// 1. Go to Firebase console -> Project settings -> Service accounts -> "Generate new private key".
// 2. Download the JSON file and place it in this backend folder as serviceAccountKey.json
// 3. NEVER commit that file to git.

let app

try {
  const serviceAccount = require('./serviceAccountKey.json')

  if (!admin.apps.length) {
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  } else {
    app = admin.app()
  }
} catch (err) {
  console.error(
    '\n[Firebase Admin] serviceAccountKey.json is missing or invalid. Download it from Firebase console (Service accounts tab) and place it in backend/.',
  )
  throw err
}

module.exports = admin

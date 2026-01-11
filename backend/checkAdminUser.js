const admin = require('./firebaseAdmin')
const email = 'bhanugovindu2007@gmail.com'

console.log('Checking for user:', email)

admin.auth().getUserByEmail(email)
    .then(user => {
        console.log('✅ User Exists!')
        console.log('UID:', user.uid)
        console.log('Email:', user.email)
        process.exit(0)
    })
    .catch(err => {
        console.log('❌ Error:', err.message) // likely 'There is no user record...'
        process.exit(1)
    })

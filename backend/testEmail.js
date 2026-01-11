// Quick SMTP test script
require('dotenv').config()
const nodemailer = require('nodemailer')

console.log('Testing SMTP configuration...')
console.log('SMTP_HOST:', process.env.SMTP_HOST)
console.log('SMTP_PORT:', process.env.SMTP_PORT)
console.log('SMTP_USER:', process.env.SMTP_USER)
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '****' + process.env.SMTP_PASS.slice(-4) : 'NOT SET')

async function testEmail() {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })

    try {
        // Verify connection
        await transporter.verify()
        console.log('✓ SMTP connection successful!')

        // Send test email
        await transporter.sendMail({
            from: `"MindSettler Test" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER, // Send to yourself
            subject: 'MindSettler - SMTP Test',
            text: 'If you receive this, SMTP is working!',
            html: '<h1>SMTP Test</h1><p>If you receive this email, SMTP is working correctly!</p>',
        })
        console.log('✓ Test email sent successfully!')
    } catch (error) {
        console.error('✗ SMTP Error:', error.message)
    }
}

testEmail()

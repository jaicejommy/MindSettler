const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
    {
        // User identification (can use email or firebaseUID)
        email: {
            type: String,
            required: true,
            index: true,
        },
        firebaseUID: {
            type: String,
            index: true,
        },
        // Message type
        type: {
            type: String,
            enum: ['booking_confirmed', 'booking_rejected', 'booking_rescheduled', 'general'],
            default: 'general',
        },
        // Message content
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        // Related booking (if applicable)
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
        },
        // Read status
        isRead: {
            type: Boolean,
            default: false,
        },
        // Additional metadata
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: true }
)

// Index for efficient querying
messageSchema.index({ email: 1, createdAt: -1 })
messageSchema.index({ firebaseUID: 1, createdAt: -1 })

module.exports = mongoose.model('Message', messageSchema)

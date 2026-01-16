const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true
        },

        category: {
            type: String,
            enum: ['article', 'blog', 'video', 'exercise'],
            default: 'article'
        },

        coverImage: {
            type: String,
            default: null
        },

        excerpt: {
            type: String,
            required: true,
            maxlength: 300
        },

        content: {
            type: String,
            required: true
        },

        isPublished: {
            type: Boolean,
            default: false
        },

        publishedAt: {
            type: Date,
            default: null
        },

        readTime: {
            type: Number,
            default: 5 // minutes
        },

        author: {
            type: String,
            default: 'MindSettler Team'
        },

        tags: [{
            type: String,
            trim: true
        }]
    },
    { timestamps: true }
)

// Generate slug from title before saving
articleSchema.pre('save', function () {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
    }

    // Calculate read time based on content (avg 200 words per minute)
    if (this.isModified('content')) {
        const wordCount = this.content.split(/\s+/).length
        this.readTime = Math.max(1, Math.ceil(wordCount / 200))
    }

    // Set publishedAt when first published
    if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
        this.publishedAt = new Date()
    }
})

// Index for efficient queries
articleSchema.index({ slug: 1 })
articleSchema.index({ isPublished: 1, publishedAt: -1 })
articleSchema.index({ category: 1, isPublished: 1 })

module.exports = mongoose.model('Article', articleSchema)

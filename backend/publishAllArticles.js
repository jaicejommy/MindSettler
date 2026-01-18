// Script to publish all articles
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const Article = require('./models/Article')

async function publishAllArticles() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB')

        // Count articles before update
        const totalCount = await Article.countDocuments()
        const draftCount = await Article.countDocuments({ isPublished: false })

        console.log(`Total articles: ${totalCount}`)
        console.log(`Draft articles: ${draftCount}`)

        if (draftCount === 0) {
            console.log('✅ All articles are already published!')
            process.exit(0)
        }

        // Update all articles to published
        const result = await Article.updateMany(
            { isPublished: false },
            {
                isPublished: true,
                publishedAt: new Date()
            }
        )

        console.log(`✅ Successfully published ${result.modifiedCount} articles!`)

        // List all articles
        const articles = await Article.find({}, 'title slug isPublished')
        console.log('\nAll articles:')
        articles.forEach(article => {
            console.log(`  - ${article.title} (${article.slug}) - ${article.isPublished ? 'Published' : 'Draft'}`)
        })

        process.exit(0)
    } catch (err) {
        console.error('Failed to publish articles:', err)
        process.exit(1)
    }
}

publishAllArticles()

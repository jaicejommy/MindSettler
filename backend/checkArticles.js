const mongoose = require('mongoose');
require('dotenv').config();
const Article = require('./models/Article');

async function checkArticles() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Article.countDocuments();
        console.log(`Total Articles: ${count}`);
        const articles = await Article.find({}, 'title slug category');
        console.log(JSON.stringify(articles, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkArticles();

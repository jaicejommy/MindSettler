const mongoose = require('mongoose');
require('dotenv').config();
const Article = require('./models/Article');

const sampleArticles = [
    {
        title: 'Understanding Anxiety: What Your Body is Trying to Tell You',
        category: 'article',
        excerpt: "Anxiety isn't always the enemy. Sometimes it's your body's way of signaling that something needs attention.",
        content: "## What is Anxiety Really?\n\nAnxiety is often misunderstood...",
        isPublished: true,
        tags: ['anxiety', 'mental-health', 'self-awareness']
    },
    {
        title: 'The 5-4-3-2-1 Grounding Technique',
        category: 'exercise',
        excerpt: 'A simple sensory exercise to help you return to the present moment when anxiety feels overwhelming.',
        content: "## What is Grounding?\n\nGrounding is a technique...",
        isPublished: true,
        tags: ['grounding', 'anxiety', 'exercise', 'coping-skills']
    }
    // I'll just try these two first to see if I can get > 1
];

async function seed() {
    try {
        console.log('Connecting to', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        console.log('Deleting all articles...');
        await Article.deleteMany({});
        console.log('Deleted.');

        for (const art of sampleArticles) {
            console.log(`Inserting: ${art.title}`);
            try {
                await Article.create(art);
                console.log('Success.');
            } catch (e) {
                console.error(`Failed to insert ${art.title}:`, e.message);
            }
        }

        const finalCount = await Article.countDocuments();
        console.log(`Final count: ${finalCount}`);

        process.exit(0);
    } catch (err) {
        console.error('Global error:', err);
        process.exit(1);
    }
}

seed();

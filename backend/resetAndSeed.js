const mongoose = require('mongoose');
require('dotenv').config();
const Article = require('./models/Article');

const sampleArticles = [
    {
        title: 'Understanding Anxiety: What Your Body is Trying to Tell You',
        category: 'article',
        excerpt: "Anxiety isn't always the enemy. Sometimes it's your body's way of signaling that something needs attention.",
        content: `## What is Anxiety Really?

Anxiety is often misunderstood as something purely negative, but it's actually a **survival mechanism** that has helped humans evolve and stay safe for thousands of years.

### The Physical Signs

When anxiety kicks in, your body responds with:
- Rapid heartbeat
- Shallow breathing
- Muscle tension
- Sweaty palms

These aren't flaws—they're features. Your body is preparing to protect you.

### Reframing Your Relationship with Anxiety

Instead of fighting anxiety, try:

1. **Acknowledge it**: "I notice I'm feeling anxious"
2. **Get curious**: "What might be triggering this?"
3. **Respond with compassion**: "This is my body trying to help me"

> The goal isn't to eliminate anxiety, but to develop a healthier relationship with it.

### When to Seek Support

If anxiety is interfering with your daily life, relationships, or work, it may be time to speak with a mental health professional. There's no shame in asking for help—it's actually a sign of strength.`,
        isPublished: true,
        tags: ['anxiety', 'mental-health', 'self-awareness']
    },
    {
        title: 'The 5-4-3-2-1 Grounding Technique',
        category: 'exercise',
        excerpt: 'A simple sensory exercise to help you return to the present moment when anxiety feels overwhelming.',
        content: `## What is Grounding?

Grounding is a technique that helps you stay connected to the present moment rather than getting lost in anxious thoughts about the future or ruminating about the past.

## The 5-4-3-2-1 Technique

When you feel overwhelmed, find a comfortable position and work through these steps:

### 5 Things You Can SEE
Look around and notice 5 things you can see. Maybe it's a plant, a photo on the wall, the texture of your desk, light coming through the window, or your own hands.

### 4 Things You Can TOUCH
Notice 4 things you can physically feel right now. The chair supporting you, your feet on the floor, the fabric of your clothes, the temperature of the air.

### 3 Things You Can HEAR
Listen for 3 sounds. Perhaps distant traffic, the hum of electronics, birds outside, or even your own breathing.

### 2 Things You Can SMELL
Identify 2 scents. Coffee nearby, fresh air, your soap or perfume, the pages of a book.

### 1 Thing You Can TASTE
Notice one taste in your mouth right now, or take a sip of water and really focus on the sensation.

## Why This Works

This technique works because it:
- Interrupts the anxiety spiral
- Engages your senses and the present moment
- Activates the parasympathetic nervous system
- Gives your mind something concrete to focus on

> Practice this technique when you're calm, so it comes naturally when you need it most.`,
        isPublished: true,
        tags: ['grounding', 'anxiety', 'exercise', 'coping-skills']
    },
    {
        title: 'Setting Healthy Boundaries Without Guilt',
        category: 'article',
        excerpt: 'Learn how to establish and maintain boundaries that protect your mental well-being without feeling guilty.',
        content: `## What Are Boundaries?

Boundaries are the invisible lines that define where you end and others begin. They're essential for healthy relationships and emotional well-being.

### Types of Boundaries

**Physical Boundaries**: Your personal space and physical touch preferences

**Emotional Boundaries**: Protecting your emotional energy and not taking responsibility for others' feelings

**Time Boundaries**: How you spend your time and energy

**Mental Boundaries**: Your right to your own thoughts and opinions

## Why We Struggle with Boundaries

Many of us were taught that:
- Saying "no" is selfish
- Other people's needs come first
- Being a good person means always being available

But these beliefs are **myths** that lead to burnout, resentment, and loss of self.

## How to Set Boundaries

### 1. Know Your Limits
- What drains you?
- What makes you feel resentful?
- What do you need to feel safe?

### 2. Use Clear Language
- "I'm not available for that"
- "I need some time to think about this"
- "That doesn't work for me"

### 3. Remember: You Don't Owe an Explanation
A simple "no" is a complete sentence.

> Saying no to something means saying yes to something else—often your own peace of mind.

## Dealing with Guilt

Guilt is common when you first start setting boundaries. Remember:
- Discomfort is part of growth
- The guilt will fade as boundaries become normal
- You're not responsible for others' reactions to your boundaries`,
        isPublished: true,
        tags: ['boundaries', 'self-care', 'relationships', 'mental-health']
    },
    {
        title: 'Body Scan Meditation: Where Do I Feel It?',
        category: 'exercise',
        excerpt: 'A guided practice that connects physical sensations with emotional patterns for deeper self-awareness.',
        content: `## Introduction

Our emotions live in our bodies. This body scan meditation helps you identify where you hold tension, stress, and emotions, building awareness that supports healing.

## Before You Begin

- Find a quiet space
- Sit or lie down comfortably
- Allow 10-15 minutes
- There's no right or wrong—just noticing

## The Practice

### Step 1: Settle In
Close your eyes. Take three deep breaths. Let your breathing return to its natural rhythm.

### Step 2: Start at Your Feet
Bring attention to your feet. Notice any sensations—warmth, tingling, pressure, nothing at all. No judgment, just observation.

### Step 3: Move Upward
Slowly move your attention up through your body:
- Ankles and calves
- Knees and thighs
- Hips and pelvis
- Lower back and abdomen
- Upper back and chest
- Shoulders and arms
- Hands and fingers
- Neck and throat
- Face and head

### Step 4: Notice Without Changing
At each area, just observe. Is there tension? Heaviness? Lightness? Numbness?

### Step 5: End with Wholeness
Finally, sense your body as a whole. Take a few deep breaths. Open your eyes when ready.

## Reflection Questions

After the scan, journal:
- Where did I hold the most tension?
- Did any emotions arise in certain areas?
- What might my body be telling me?

> Over time, you'll notice patterns—perhaps you always carry stress in your shoulders, or anxiety in your chest. This awareness is the first step to healing.`,
        isPublished: true,
        tags: ['meditation', 'body-scan', 'mindfulness', 'exercise']
    },
    {
        title: 'Emotional Hygiene: Daily Practices for Mental Wellness',
        category: 'article',
        excerpt: "Small, doable practices that help you check in with yourself before things feel too heavy.",
        content: `## What is Emotional Hygiene?

Just like we brush our teeth daily and shower regularly, our emotional health needs regular maintenance too. Emotional hygiene refers to the daily practices that keep our mental health in check.

## Why It Matters

We live in a world that constantly demands our attention and energy. Without regular emotional care:
- Small stresses accumulate
- Minor wounds become major ones
- We lose touch with ourselves

## Daily Practices

### 1. Morning Check-In (2 minutes)
Before checking your phone, ask yourself:
- How am I feeling right now?
- What do I need today?
- What am I grateful for?

### 2. Emotional Labeling
Throughout the day, name your emotions. "I'm feeling anxious" or "I notice frustration." This simple act reduces emotional intensity.

### 3. The 3-Minute Pause
Set a reminder to pause 2-3 times daily:
- Stop what you're doing
- Take 3 deep breaths
- Notice your body and feelings
- Continue with awareness

### 4. Evening Processing
Before bed, spend 5 minutes:
- Writing in a journal
- Or simply reflecting: What went well? What was challenging?

### 5. Weekly Deeper Clean
Set aside time weekly for:
- Longer reflection or meditation
- Connecting with someone who supports you
- Activities that bring joy and restore energy

## Common Obstacles

**"I don't have time"**: Start with just 2 minutes. That's long enough to make a difference.

**"I forget"**: Link it to existing habits (like your morning coffee) or set phone reminders.

**"I'm not sure I'm doing it right"**: There's no wrong way. Any attention to your emotional state is valuable.

> Consistency matters more than perfection. A few minutes every day is more powerful than an hour once a month.`,
        isPublished: true,
        tags: ['self-care', 'daily-practices', 'mental-health', 'wellness']
    },
    {
        title: 'Understanding Your Emotional Patterns',
        category: 'video',
        excerpt: 'Explore how our emotions develop patterns over time and what we can do to recognize them.',
        content: `## Why Patterns Form

We all develop emotional patterns—automatic ways of responding to situations based on past experiences. Understanding these patterns is key to personal growth.

## Common Emotional Patterns

### The People Pleaser
- Says yes when they mean no
- Prioritizes others' needs over their own
- Fears conflict or disapproval

### The Avoider
- Distracts from difficult emotions
- Stays busy to avoid feeling
- May use substances, work, or screens to escape

### The Perfectionist
- Sets impossibly high standards
- Ties self-worth to achievement
- Fears failure intensely

### The Over-Thinker
- Analyzes situations excessively
- Struggles with decision-making
- Gets stuck in "what if" spirals

## Identifying Your Patterns

Ask yourself:
1. What situations trigger strong reactions in me?
2. What do I typically do when I feel uncomfortable emotions?
3. Are there repeating themes in my relationships or conflicts?
4. What feedback do I often receive from others?

## Breaking Unhelpful Patterns

### Step 1: Awareness
You can't change what you don't notice. Pay attention to your automatic responses.

### Step 2: Pause
When triggered, create space between stimulus and response. Even 3 seconds helps.

### Step 3: Choose
Consider: Is this response serving me? What might I do differently?

### Step 4: Practice
New patterns take time. Be patient and celebrate small wins.

> Patterns formed over years won't change overnight. But with consistent awareness and practice, change is absolutely possible.`,
        isPublished: true,
        tags: ['emotional-patterns', 'self-awareness', 'growth', 'psychology']
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing
        await Article.deleteMany({});
        console.log('Cleared existing articles');

        // Insert new
        await Article.insertMany(sampleArticles);
        console.log('Seeded 6 sample articles');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();

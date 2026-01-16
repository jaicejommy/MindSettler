import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ResourcesPage.css'

// Sample resources data with simplified categories
const resourcesData = [
  {
    id: 1,
    category: 'article',
    title: 'Stress vs. Burnout: What\'s the Difference?',
    excerpt: 'Why feeling tired isn\'t the same as being emotionally exhausted, and how to notice early warning signs.'
  },
  {
    id: 2,
    category: 'video',
    title: 'Understanding Your Emotional Patterns',
    excerpt: 'A guided video exploring how our emotions develop patterns over time and what we can do to recognize them.'
  },
  {
    id: 3,
    category: 'article',
    title: 'Emotional Hygiene for Everyday Life',
    excerpt: 'Small, doable practices that help you check in with yourself before things feel too heavy.'
  },
  {
    id: 4,
    category: 'exercise',
    title: 'The 5-4-3-2-1 Grounding Technique',
    excerpt: 'A simple sensory exercise to help you return to the present moment when anxiety feels overwhelming.'
  },
  {
    id: 5,
    category: 'article',
    title: 'Setting Healthy Boundaries',
    excerpt: 'Learn how to establish and maintain boundaries that protect your mental well-being without guilt.'
  },
  {
    id: 6,
    category: 'exercise',
    title: 'Body Scan: Where Do I Feel It?',
    excerpt: 'A guided prompt that connects physical sensations with emotional patterns for deeper self-awareness.'
  },
  {
    id: 7,
    category: 'video',
    title: 'Mindful Breathing: A 10-Minute Practice',
    excerpt: 'Follow along with this calming video to learn breathing techniques that reduce stress and anxiety.'
  },
  {
    id: 8,
    category: 'exercise',
    title: 'Journaling Prompts for Self-Reflection',
    excerpt: 'Thoughtful questions to help you explore your feelings and gain clarity on what matters most.'
  }
]

// Simplified categories
const categories = [
  { id: 'all', label: 'All' },
  { id: 'article', label: 'Articles' },
  { id: 'video', label: 'Videos' },
  { id: 'exercise', label: 'Exercises' }
]

export default function PsychoEducationPage() {
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredResources = activeFilter === 'all'
    ? resourcesData
    : resourcesData.filter(r => r.category === activeFilter)

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'video':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )
      case 'article':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        )
      case 'exercise':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="resources-hero">
        <div className="resources-hero-content">
          <h1 className="resources-hero-title">
            Resources
            <span>for your Mind</span>
          </h1>
          <p className="resources-hero-subtitle">
            Curated content to support your mental wellness journey.
            Explore articles, videos, and exercises designed to help you thrive.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="resources-main">
        {/* Category Tabs */}
        <div className="resources-tabs">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`tab-btn ${activeFilter === cat.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Resources List */}
        <div className="resources-list">
          {filteredResources.length > 0 ? (
            filteredResources.map(resource => (
              <article key={resource.id} className="resource-item">
                <div className={`resource-icon ${resource.category}`}>
                  {getCategoryIcon(resource.category)}
                </div>
                <div className="resource-content">
                  <div className="resource-meta">
                    <span className={`resource-category ${resource.category}`}>
                      {resource.category}
                    </span>
                  </div>
                  <h3 className="resource-title">{resource.title}</h3>
                  <p className="resource-excerpt">{resource.excerpt}</p>
                </div>
                <svg className="resource-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </article>
            ))
          ) : (
            <div className="resources-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p>No resources found in this category.</p>
            </div>
          )}
        </div>
      </section>

    </main>
  )
}

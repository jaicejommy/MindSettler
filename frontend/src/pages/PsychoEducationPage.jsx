import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './ResourcesPage.css'

const categories = [
  { id: 'all', label: 'All' },
  { id: 'article', label: 'Articles' },
  { id: 'video', label: 'Videos' },
  { id: 'exercise', label: 'Exercises' }
]

export default function PsychoEducationPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch articles from API
  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/articles`)

        if (response.ok) {
          const data = await response.json()
          setResources(data.articles || [])
        } else {
          setResources([])
        }
      } catch (err) {
        console.error('Failed to fetch articles:', err)
        setResources([])
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const filteredResources = activeFilter === 'all'
    ? resources
    : resources.filter(r => r.category === activeFilter)

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

        {/* Loading State */}
        {loading ? (
          <div className="resources-loading">
            <div className="resources-loading-spinner" />
            <p>Loading resources...</p>
          </div>
        ) : (
          /* Resources List */
          <div className="resources-list">
            {filteredResources.length > 0 ? (
              filteredResources.map(resource => (
                <Link
                  key={resource._id || resource.id}
                  to={`/article/${resource.slug}`}
                  className="resource-item-link"
                >
                  <article className="resource-item">
                    <div className={`resource-icon ${resource.category}`}>
                      {getCategoryIcon(resource.category)}
                    </div>
                    <div className="resource-content">
                      <div className="resource-meta">
                        <span className={`resource-category ${resource.category}`}>
                          {resource.category}
                        </span>
                        {resource.readTime && (
                          <span className="resource-read-time">{resource.readTime} min read</span>
                        )}
                      </div>
                      <h3 className="resource-title">{resource.title}</h3>
                      <p className="resource-excerpt">{resource.excerpt}</p>
                    </div>
                    <svg className="resource-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </article>
                </Link>
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
        )}
      </section>
    </main>
  )
}

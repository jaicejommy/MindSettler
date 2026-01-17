import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './ArticlePage.css'

// Simple markdown to HTML converter (safe rendering)
function parseMarkdown(text) {
    if (!text) return ''

    let html = text
        // Escape HTML to prevent XSS
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold and italic
        .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        // Links
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        // Images
        .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" loading="lazy" />')
        // Code blocks
        .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        // Inline code
        .replace(/`(.*?)`/gim, '<code>$1</code>')
        // Blockquotes
        .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
        // Unordered lists
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        // Horizontal rule
        .replace(/^---$/gim, '<hr />')
        // Paragraphs (double newlines)
        .replace(/\n\n/g, '</p><p>')
        // Single newlines in paragraphs
        .replace(/\n/g, '<br />')

    // Wrap in paragraph tags
    html = '<p>' + html + '</p>'

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '')
    html = html.replace(/<p><h/g, '<h')
    html = html.replace(/<\/h(\d)><\/p>/g, '</h$1>')
    html = html.replace(/<p><blockquote>/g, '<blockquote>')
    html = html.replace(/<\/blockquote><\/p>/g, '</blockquote>')
    html = html.replace(/<p><pre>/g, '<pre>')
    html = html.replace(/<\/pre><\/p>/g, '</pre>')
    html = html.replace(/<p><hr \/><\/p>/g, '<hr />')
    html = html.replace(/<p><li>/g, '<ul><li>')
    html = html.replace(/<\/li><\/p>/g, '</li></ul>')

    return html
}

// Format date nicely
function formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

export default function ArticlePage() {
    const { slug } = useParams()
    const [article, setArticle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [readProgress, setReadProgress] = useState(0)

    // Fetch article
    useEffect(() => {
        async function fetchArticle() {
            try {
                setLoading(true)
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/articles/${slug}`)

                if (!response.ok) {
                    throw new Error('Article not found')
                }

                const data = await response.json()
                setArticle(data.article)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (slug) {
            fetchArticle()
        }
    }, [slug])

    // Reading progress tracker
    useEffect(() => {
        function handleScroll() {
            const scrollTop = window.scrollY
            const docHeight = document.documentElement.scrollHeight - window.innerHeight
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
            setReadProgress(Math.min(100, progress))
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (loading) {
        return (
            <main>
                <div className="article-loading">
                    <div className="article-loading-spinner" />
                    <p>Loading article...</p>
                </div>
            </main>
        )
    }

    if (error || !article) {
        return (
            <main>
                <div className="article-not-found">
                    <h2>Article Not Found</h2>
                    <p>Sorry, we couldn't find the article you're looking for.</p>
                    <Link to="/psycho-education" className="article-back-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        Back to Resources
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main>
            {/* Reading Progress */}
            <div className="reading-progress" style={{ width: `${readProgress}%` }} />

            {/* Hero Image */}
            <section className="article-hero">
                {article.coverImage ? (
                    <img
                        src={article.coverImage}
                        alt={article.title}
                        className="article-hero-image"
                    />
                ) : null}
                <div className="article-hero-overlay" />
            </section>

            {/* Article Header */}
            <div className="article-container">
                <header className="article-header">
                    <div className="article-meta">
                        <span className={`article-category ${article.category}`}>
                            {article.category}
                        </span>
                        <span className="article-date">{formatDate(article.publishedAt)}</span>
                        <span className="article-read-time">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {article.readTime} min read
                        </span>
                    </div>
                    <h1 className="article-title">{article.title}</h1>
                    <p className="article-author">
                        By <strong>{article.author || 'MindSettler Team'}</strong>
                    </p>
                </header>

                {/* Article Content */}
                <article
                    className="article-content"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(article.content) }}
                />

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                    <div className="article-tags">
                        {article.tags.map((tag, index) => (
                            <span key={index} className="article-tag">#{tag}</span>
                        ))}
                    </div>
                )}

                {/* Back Link */}
                <Link to="/psycho-education" className="article-back-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back to Resources
                </Link>
            </div>
        </main>
    )
}

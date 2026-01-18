import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Heart, ArrowRight } from 'lucide-react'
import ChatBot from './ChatBot'
import authedApi from '../authedApi'
import { listenToAuthChanges, logout } from '../firebase'

function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('intro')

  // Listen for external open event
  useEffect(() => {
    const handleOpenChatbot = () => setOpen(true)
    window.addEventListener('openChatbot', handleOpenChatbot)
    return () => window.removeEventListener('openChatbot', handleOpenChatbot)
  }, [])

  const restart = () => setStep('intro')

  return (
    <div className="chatbot-root">
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div>
              <p className="eyebrow">MindSettler guide</p>
              <h3>How can we help you today?</h3>
            </div>
            <button
              type="button"
              className="icon-btn"
              aria-label="Close chatbot"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="chatbot-body">
            {step === 'intro' && (
              <>
                <p>
                  I am a simple guide that can help you understand MindSettler&apos;s services and how to book a
                  session.
                </p>
                <p className="muted">
                  I do <strong>not</strong> provide psychological advice or crisis support.
                </p>
                <div className="chatbot-options">
                  <button type="button" onClick={() => setStep('services')} className="pill">
                    Understand services
                  </button>
                  <button type="button" onClick={() => setStep('booking')} className="pill">
                    How to book a session
                  </button>
                  <button type="button" onClick={() => setStep('corporate')} className="pill">
                    Corporate / group enquiries
                  </button>
                </div>
              </>
            )}
            {step === 'services' && (
              <>
                <p>
                  MindSettler offers structured psycho-education sessions that help you understand your patterns,
                  emotions, and behaviours. It is not a substitute for therapy or psychiatry, but can complement
                  them.
                </p>
                <p>
                  If you have personal questions about your mental health, the best place to explore them is inside
                  a session with a trained professional.
                </p>
                <button
                  type="button"
                  className="primary-link"
                  onClick={() => window.location.href = '/booking'}
                >
                  Go to booking section
                </button>
                <button type="button" className="secondary-link" onClick={restart}>
                  Back
                </button>
              </>
            )}
            {step === 'booking' && (
              <>
                <p>
                  You can request a 60-minute session by filling the booking form on this page. You will be able to
                  pick a date and see available time slots.
                </p>
                <p>
                  Your appointment is first marked as pending, and is then confirmed by MindSettler over
                  email/WhatsApp. Payment details are shared only after confirmation.
                </p>
                <button
                  type="button"
                  className="primary-link"
                  onClick={() => window.location.href = '/booking'}
                >
                  Open booking form
                </button>
                <button type="button" className="secondary-link" onClick={restart}>
                  Back
                </button>
              </>
            )}
            {step === 'corporate' && (
              <>
                <p>
                  MindSettler partners with organisations for workshops, group spaces, and long-term mental
                  well-being journeys.
                </p>
                <p>
                  You can share your context and requirements in the corporate section. Someone from MindSettler
                  will write back to you.
                </p>
                <button
                  type="button"
                  className="primary-link"
                  onClick={() => window.location.href = '/corporate'}
                >
                  Open corporate form
                </button>
                <button type="button" className="secondary-link" onClick={restart}>
                  Back
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <button
        type="button"
        className="chatbot-toggle"
        aria-label="Open chatbot"
        onClick={() => setOpen(!open)}
      >
        {open ? 'Close' : 'Chat'}
      </button>
    </div>
  )
}

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [firebaseUser, setFirebaseUser] = useState(null)
  const [accountUser, setAccountUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true) // Track auth loading state

  // Notifications state
  const [messages, setMessages] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifOpen, setNotifOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = listenToAuthChanges(async (user) => {
      setFirebaseUser(user)
      setAccountUser(null)
      setMessages([])
      setUnreadCount(0)
      setAuthLoading(false) // Auth check complete

      if (user) {
        try {
          const [meRes, msgRes] = await Promise.all([
            authedApi.get('/me'),
            authedApi.get('/me/messages'),
          ])
          setAccountUser(meRes.data.user || null)
          setMessages(msgRes.data.messages || [])
          setUnreadCount(msgRes.data.unreadCount || 0)
        } catch (err) {
          console.error('Failed to load user for header:', err)
        }
      }
    })

    function handleProfileUpdated(evt) {
      if (evt.detail && evt.detail.user) {
        setAccountUser(evt.detail.user)
      }
    }

    window.addEventListener('mindsettler-profile-updated', handleProfileUpdated)

    return () => {
      unsubscribe()
      window.removeEventListener('mindsettler-profile-updated', handleProfileUpdated)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifOpen && !e.target.closest('.notif-dropdown-container')) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [notifOpen])

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const handleLogout = async () => {
    try {
      await logout()
      setFirebaseUser(null)
      setAccountUser(null)
      closeMobileMenu()
      navigate('/')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  // Check if current path is active
  const isActive = (path) => location.pathname === path

  const markAsRead = async (msgId) => {
    try {
      await authedApi.patch(`/me/messages/${msgId}/read`)
      setMessages(messages.map(m => m._id === msgId ? { ...m, isRead: true } : m))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to mark as read', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await authedApi.patch('/me/messages/read-all')
      setMessages(messages.map(m => ({ ...m, isRead: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Failed to mark all as read', err)
    }
  }

  return (
    <header className="top-nav">
      <div className="nav-inner">
        <div className="brand" onClick={() => { window.location.href = '/'; closeMobileMenu() }} style={{ cursor: 'pointer' }}>
          <img
            src="/Mindsettler_logo_Final-Photoroom.png"
            alt="MindSettler by Parnika - Psycho-education & mental well-being studio"
            className="brand-logo-img"
          />
        </div>

        {/* Mobile header actions - Profile and Notifications visible outside dropdown */}
        <div className="mobile-header-actions">
          {/* Notification Bell */}
          {firebaseUser && (
            <div className="notif-dropdown-container" style={{ position: 'relative' }}>
              <button
                type="button"
                className="mobile-action-btn"
                onClick={() => setNotifOpen(!notifOpen)}
                style={{ position: 'relative' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3F2965" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#DD1764"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#3F2965"></path>
                </svg>
                {unreadCount > 0 && (
                  <span className="notif-badge">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifOpen && (
                <div
                  className="mobile-notif-dropdown"
                  style={{
                    position: 'fixed',
                    top: '60px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'min(320px, calc(100vw - 2rem))',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(63, 41, 101, 0.2)',
                    border: '1px solid rgba(63, 41, 101, 0.1)',
                    zIndex: 1000,
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid rgba(63, 41, 101, 0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1a1a2e' }}>
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#6b5b95',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Messages List */}
                  {messages.length === 0 ? (
                    <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(63, 41, 101, 0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '0.5rem' }}>
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-soft)' }}>
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    <div>
                      {messages.slice(0, 5).map((msg) => (
                        <div
                          key={msg._id}
                          onClick={() => {
                            if (!msg.isRead) markAsRead(msg._id)
                            setNotifOpen(false)
                            navigate('/auth')
                          }}
                          style={{
                            padding: '0.75rem 1rem',
                            borderBottom: '1px solid rgba(63, 41, 101, 0.06)',
                            cursor: 'pointer',
                            background: msg.isRead ? 'transparent' : 'rgba(241, 237, 255, 0.5)',
                            transition: 'background 0.2s',
                          }}
                        >
                          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                            {/* Icon */}
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: '8px',
                                background: msg.type === 'booking_confirmed'
                                  ? 'rgba(0, 150, 80, 0.12)'
                                  : msg.type === 'booking_rejected'
                                    ? 'rgba(220, 53, 69, 0.12)'
                                    : msg.type === 'booking_rescheduled'
                                      ? 'rgba(59, 130, 246, 0.12)'
                                      : 'rgba(63, 41, 101, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {msg.type === 'booking_confirmed' && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#006644" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              )}
                              {msg.type === 'booking_rejected' && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              )}
                              {msg.type === 'booking_rescheduled' && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                  <line x1="16" y1="2" x2="16" y2="6"></line>
                                  <line x1="8" y1="2" x2="8" y2="6"></line>
                                </svg>
                              )}
                              {msg.type === 'general' && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3f2965" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="12" y1="16" x2="12" y2="12"></line>
                                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                              )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                                <span style={{
                                  fontSize: '0.8rem',
                                  fontWeight: msg.isRead ? 500 : 600,
                                  color: msg.isRead ? 'var(--text-soft)' : '#1a1a2e',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}>
                                  {msg.title}
                                </span>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-soft)', flexShrink: 0, marginLeft: '0.5rem' }}>
                                  {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              <p style={{
                                margin: 0,
                                fontSize: '0.75rem',
                                color: 'var(--text-soft)',
                                lineHeight: 1.3,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}>
                                {msg.content}
                              </p>
                            </div>
                            {!msg.isRead && (
                              <div
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  background: '#6b5b95',
                                  flexShrink: 0,
                                  marginTop: '0.25rem',
                                }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  {messages.length > 0 && (
                    <div
                      style={{
                        padding: '0.6rem 1rem',
                        borderTop: '1px solid rgba(63, 41, 101, 0.1)',
                        textAlign: 'center',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setNotifOpen(false)
                          navigate('/auth')
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#6b5b95',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          fontWeight: 500,
                        }}
                      >
                        View all in Profile →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Profile Button */}
          <button
            type="button"
            className="mobile-action-btn"
            onClick={() => {
              navigate('/auth')
              closeMobileMenu()
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#3F2965"></path>
              <circle cx="12" cy="7" r="4" stroke="#DD1764"></circle>
            </svg>
          </button>
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-nav-overlay" onClick={closeMobileMenu}>
            <nav className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
              {/* Mobile Nav Header */}
              <div className="mobile-nav-header">
                <img
                  src="/Mindsettler_logo_Final-Photoroom.png"
                  alt="MindSettler"
                  className="mobile-nav-logo"
                  onClick={() => { window.location.href = '/'; closeMobileMenu() }}
                  style={{ cursor: 'pointer' }}
                />
                <button type="button" className="mobile-nav-close" onClick={closeMobileMenu}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Mobile Nav Links */}
              <div className="mobile-nav-links">
                <a href="/" onClick={closeMobileMenu} className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}>
                  <span className="mobile-nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </span>
                  <span className="mobile-nav-text">Home</span>
                </a>

                <a href="/about" onClick={closeMobileMenu} className={`mobile-nav-item ${isActive('/about') ? 'active' : ''}`}>
                  <span className="mobile-nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </span>
                  <span className="mobile-nav-text">About</span>
                </a>

                <a href="/psycho-education" onClick={closeMobileMenu} className={`mobile-nav-item ${isActive('/psycho-education') ? 'active' : ''}`}>
                  <span className="mobile-nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                  </span>
                  <span className="mobile-nav-text">Resources</span>
                </a>

                <a href="/booking" onClick={closeMobileMenu} className={`mobile-nav-item ${isActive('/booking') ? 'active' : ''}`}>
                  <span className="mobile-nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </span>
                  <span className="mobile-nav-text">Book a session</span>
                </a>

                <a href="/corporate" onClick={closeMobileMenu} className={`mobile-nav-item ${isActive('/corporate') ? 'active' : ''}`}>
                  <span className="mobile-nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21h18"></path>
                      <path d="M9 8h1"></path>
                      <path d="M9 12h1"></path>
                      <path d="M9 16h1"></path>
                      <path d="M14 8h1"></path>
                      <path d="M14 12h1"></path>
                      <path d="M14 16h1"></path>
                      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
                    </svg>
                  </span>
                  <span className="mobile-nav-text">Corporate</span>
                </a>



                <a href="/contact" onClick={closeMobileMenu} className={`mobile-nav-item ${isActive('/contact') ? 'active' : ''}`}>
                  <span className="mobile-nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <span className="mobile-nav-text">Contact</span>
                </a>
              </div>

              {/* Mobile Nav Auth Buttons */}
              <div className="mobile-nav-auth">
                {firebaseUser ? (
                  <>
                    <a href="/auth" onClick={closeMobileMenu} className="mobile-nav-btn-outline">
                      Profile
                    </a>
                    <button type="button" onClick={handleLogout} className="mobile-nav-btn-primary">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <a href="/auth" onClick={closeMobileMenu} className="mobile-nav-btn-outline">
                      Login
                    </a>
                    <a href="/auth" onClick={closeMobileMenu} className="mobile-nav-btn-primary">
                      Sign Up Now
                    </a>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}

        {/* Desktop Navigation - Center Links */}
        <nav className="nav-center desktop-nav">
          <a href="/about" onClick={closeMobileMenu} className={isActive('/about') ? 'nav-active' : ''}>
            <button type="button">About</button>
          </a>
          <a href="/psycho-education" onClick={closeMobileMenu} className={isActive('/psycho-education') ? 'nav-active' : ''}>
            <button type="button">Resources</button>
          </a>
          <a href="/booking" onClick={closeMobileMenu} className={isActive('/booking') ? 'nav-active' : ''}>
            <button type="button">Book a session</button>
          </a>
          <a href="/corporate" onClick={closeMobileMenu} className={isActive('/corporate') ? 'nav-active' : ''}>
            <button type="button">Corporate</button>
          </a>
          <a href="/contact" onClick={closeMobileMenu} className={isActive('/contact') ? 'nav-active' : ''}>
            <button type="button">Contact</button>
          </a>
        </nav>

        {/* Desktop Navigation - Right Section (Profile, Notifications, Auth) */}
        <div className="nav-right desktop-nav">
          {/* Notification Bell */}
          {firebaseUser && (
            <div className="notif-dropdown-container" style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                style={{ position: 'relative' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#DD1764"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#3F2965"></path>
                </svg>
                {unreadCount > 0 && (
                  <span className="notif-badge">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    width: '320px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(63, 41, 101, 0.2)',
                    border: '1px solid rgba(63, 41, 101, 0.1)',
                    zIndex: 1000,
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid rgba(63, 41, 101, 0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1a1a2e' }}>
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#6b5b95',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Messages List */}
                  {messages.length === 0 ? (
                    <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(63, 41, 101, 0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '0.5rem' }}>
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-soft)' }}>
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    <div>
                      {messages.slice(0, 5).map((msg) => (
                        <div
                          key={msg._id}
                          onClick={() => {
                            if (!msg.isRead) markAsRead(msg._id)
                            setNotifOpen(false)
                            navigate('/auth')
                          }}
                          style={{
                            padding: '0.75rem 1rem',
                            borderBottom: '1px solid rgba(63, 41, 101, 0.06)',
                            cursor: 'pointer',
                            background: msg.isRead ? 'transparent' : 'rgba(241, 237, 255, 0.5)',
                            transition: 'background 0.2s',
                          }}
                        >
                          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                            {/* Icon */}
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: '8px',
                                background: msg.type === 'booking_confirmed'
                                  ? 'rgba(0, 150, 80, 0.12)'
                                  : msg.type === 'booking_rejected'
                                    ? 'rgba(220, 53, 69, 0.12)'
                                    : msg.type === 'booking_rescheduled'
                                      ? 'rgba(59, 130, 246, 0.12)'
                                      : 'rgba(63, 41, 101, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {msg.type === 'booking_confirmed' && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#006644" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              )}
                              {msg.type === 'booking_rejected' && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              )}
                              {msg.type === 'booking_rescheduled' && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                  <line x1="16" y1="2" x2="16" y2="6"></line>
                                  <line x1="8" y1="2" x2="8" y2="6"></line>
                                </svg>
                              )}
                              {msg.type === 'general' && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3f2965" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="12" y1="16" x2="12" y2="12"></line>
                                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                              )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                                <span style={{
                                  fontSize: '0.8rem',
                                  fontWeight: msg.isRead ? 500 : 600,
                                  color: msg.isRead ? 'var(--text-soft)' : '#1a1a2e',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}>
                                  {msg.title}
                                </span>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-soft)', flexShrink: 0, marginLeft: '0.5rem' }}>
                                  {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              <p style={{
                                margin: 0,
                                fontSize: '0.75rem',
                                color: 'var(--text-soft)',
                                lineHeight: 1.3,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}>
                                {msg.content}
                              </p>
                            </div>
                            {!msg.isRead && (
                              <div
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  background: '#6b5b95',
                                  flexShrink: 0,
                                  marginTop: '0.25rem',
                                }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  {messages.length > 0 && (
                    <div
                      style={{
                        padding: '0.6rem 1rem',
                        borderTop: '1px solid rgba(63, 41, 101, 0.1)',
                        textAlign: 'center',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setNotifOpen(false)
                          navigate('/auth')
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#6b5b95',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          fontWeight: 500,
                        }}
                      >
                        View all in Profile →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Profile Button - only show when auth is loaded and user is logged in */}
          {!authLoading && firebaseUser && (
            <a
              href="/auth"
              onClick={(e) => {
                e.preventDefault()
                navigate('/auth')
              }}
            >
              <button type="button" className="nav-profile-btn">Profile</button>
            </a>
          )}

          {/* Sign in / Logout - only show when auth is loaded */}
          {!authLoading && (
            firebaseUser ? (
              <button type="button" onClick={handleLogout} className="nav-logout-btn">
                Logout
              </button>
            ) : (
              <a href="/auth">
                <button type="button" className="nav-signin-btn">Sign in</button>
              </a>
            )
          )}

          {/* Admin Button */}
          <a href="/admin">
            <button type="button" className="nav-admin-btn">Admin</button>
          </a>
        </div>
      </div>
    </header>
  )
}


function Footer() {
  return (
    <footer className="bg-secondary-950 text-white pt-24 pb-12 rounded-t-[3rem] mt-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-900 to-secondary-950 z-0"></div>

      {/* Abstract Shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-900/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-800/20 rounded-full blur-[100px]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <img
              src="/Mindsettler_logo_Final-Photoroom.png"
              alt="MindSettler"
              className="w-48 h-auto mb-6 bg-white p-3 rounded-xl"
            />
            <p className="text-secondary-200 text-sm leading-relaxed mb-8 opacity-80">
              Gentle, structured, and grounded in real life. Making mental health support accessible and understandable for everyone.
            </p>
            {/* Instagram Link */}
            <a
              href="https://www.instagram.com/mindsettlerbypb/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-secondary-300 hover:text-white transition-colors text-sm group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span className="group-hover:translate-x-1 transition-transform duration-200">@mindsettlerbypb</span>
            </a>
          </div>

          <div className="col-span-1">
            <h4 className="font-bold text-lg mb-6 text-white">Company</h4>
            <ul className="space-y-4">
              <li><a href="/about" className="text-secondary-300 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block duration-200">About</a></li>
              <li><a href="/psycho-education" className="text-secondary-300 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block duration-200">Psycho-education</a></li>
              <li><a href="/therapies" className="text-secondary-300 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block duration-200">Therapies</a></li>
              <li><a href="/corporate" className="text-secondary-300 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block duration-200">Corporate</a></li>
              <li><a href="/#journey" className="text-secondary-300 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block duration-200">Our Journey</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-bold text-lg mb-6 text-white">Support</h4>
            <ul className="space-y-4">
              <li><a href="/booking" className="text-secondary-300 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block duration-200">Book a Session</a></li>
              <li><a href="/contact" className="text-secondary-300 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block duration-200">Contact Us</a></li>
              <li><a href="/faqs" className="text-secondary-300 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block duration-200">FAQs</a></li>
              <li><a href="/privacy" className="text-secondary-300 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block duration-200">Privacy Policy</a></li>
              <li><a href="/non-refund" className="text-secondary-300 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block duration-200">Refund Policy</a></li>
              <li><a href="/confidentiality" className="text-secondary-300 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block duration-200">Terms of Service</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-bold text-lg mb-6 text-white">Get in touch</h4>
            <a href="/booking" className="footer-cta-btn">
              <button className="w-full py-4 bg-white text-secondary-950 rounded-xl font-bold hover:bg-primary-50 transition-all mb-4 shadow-lg hover:shadow-white/20">
                Book a Consultation
              </button>
            </a>
            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <a href="tel:+919974631313" className="footer-contact-link flex items-center gap-2 text-secondary-300 hover:text-white transition-colors text-sm">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span className="underline-text">+91 9974631313</span>
              </a>
              <a href="mailto:mindsettler.parnika@gmail.com" className="footer-contact-link flex items-center gap-2 text-secondary-300 hover:text-white transition-colors text-sm">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span className="underline-text">mindsettler.parnika@gmail.com</span>
              </a>
            </div>
            <p className="text-[10px] text-secondary-400 leading-tight">
              * This website is for informational purposes only and is not a substitute for professional medical care.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary-400 text-sm">© {new Date().getFullYear()} MindSettler. All rights reserved.</p>
          <div className="flex items-center gap-2 text-secondary-400 text-sm bg-white/5 px-4 py-1.5 rounded-full">
            <span>Designed with</span>
            <Heart className="w-3 h-3 text-primary-500 fill-primary-500 animate-pulse" />
            <span>for wellness</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <div className="app-root app-ready">
        {children}
        <Footer />
      </div>
    </>
  )
}

// Admin layout - no navbar, just a back button
export function AdminLayout({ children }) {
  return (
    <>
      <div className="admin-back-bar" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '48px',
        background: 'linear-gradient(135deg, #3f2965 0%, #6b5b95 100%)',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '1rem',
        zIndex: 1000,
      }}>
        <a href="/" style={{
          color: 'white',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem',
          fontWeight: 500,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Website
        </a>
      </div>
      <div style={{ paddingTop: '48px', minHeight: '100vh' }}>
        {children}
      </div>
    </>
  )
}

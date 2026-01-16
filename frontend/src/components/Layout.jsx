import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Heart, ArrowRight } from 'lucide-react'
import ChatBot from './ChatBot'
import authedApi from '../authedApi'
import { listenToAuthChanges, logout } from '../firebase'

function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('intro')

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
        <div className="brand" onClick={() => { navigate('/'); closeMobileMenu() }} style={{ cursor: 'pointer' }}>
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
                  <span className="mobile-nav-text">Psycho-education</span>
                </a>

                <a href="/journey" onClick={closeMobileMenu} className={`mobile-nav-item ${isActive('/journey') ? 'active' : ''}`}>
                  <span className="mobile-nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </span>
                  <span className="mobile-nav-text">Journey</span>
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

                <a href="/faqs" onClick={closeMobileMenu} className={`mobile-nav-item ${isActive('/faqs') ? 'active' : ''}`}>
                  <span className="mobile-nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </span>
                  <span className="mobile-nav-text">FAQs</span>
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

        {/* Desktop Navigation */}
        <nav className="nav-links desktop-nav">
          <a href="/about" onClick={closeMobileMenu}>
            <button type="button">About</button>
          </a>
          <a href="/psycho-education" onClick={closeMobileMenu}>
            <button type="button">Psycho-education</button>
          </a>
          <a href="/journey" onClick={closeMobileMenu}>
            <button type="button">Journey</button>
          </a>
          <a href="/booking" onClick={closeMobileMenu}>
            <button type="button">Book a session</button>
          </a>
          <a href="/corporate" onClick={closeMobileMenu}>
            <button type="button">Corporate</button>
          </a>
          <a href="/faqs" onClick={closeMobileMenu}>
            <button type="button">FAQs</button>
          </a>
          <a href="/contact" onClick={closeMobileMenu}>
            <button type="button">Contact</button>
          </a>

          {/* User profile / auth */}
          {firebaseUser ? (
            <>
              <a
                href="/auth"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/auth')
                }}
              >
                <button type="button">Profile</button>
              </a>
              <button type="button" onClick={handleLogout} className="nav-logout-btn">
                Logout
              </button>
            </>
          ) : (
            <a href="/auth">
              <button type="button">Sign in</button>
            </a>
          )}

          {/* Admin Portal Link */}
          <a href="http://localhost:5174" target="_blank" rel="noopener noreferrer">
            <button type="button" className="nav-admin-btn">
              Admin
            </button>
          </a>

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
        </nav>
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
             <div className="flex items-center gap-2 mb-6">
                <Heart className="w-6 h-6 text-primary-400 fill-primary-400" />
                <span className="font-display text-2xl font-bold tracking-tight">MindSettler</span>
             </div>
             <p className="text-secondary-200 text-sm leading-relaxed mb-8 opacity-80">
               Gentle, structured, and grounded in real life. Making mental health support accessible and understandable for everyone.
             </p>
             <div className="flex gap-4">
               {['Instagram', 'Twitter', 'LinkedIn'].map((social) => (
                 <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 transition-all duration-300 group">
                    <span className="sr-only">{social}</span>
                    <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                 </a>
               ))}
             </div>
          </div>

          <div className="col-span-1">
            <h4 className="font-bold text-lg mb-6 text-white">Company</h4>
            <ul className="space-y-4">
              {['About', 'Psycho-education', 'Our Team', 'Careers'].map(item => (
                <li key={item}><a href="#" className="text-secondary-300 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block duration-200">{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-bold text-lg mb-6 text-white">Support</h4>
            <ul className="space-y-4">
              {['Contact Us', 'FAQs', 'Privacy Policy', 'Terms of Service'].map(item => (
                <li key={item}><a href="#" className="text-secondary-300 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block duration-200">{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
             <h4 className="font-bold text-lg mb-6 text-white">Get in touch</h4>
             <button className="w-full py-4 bg-white text-secondary-950 rounded-xl font-bold hover:bg-primary-50 transition-all mb-4 shadow-lg hover:shadow-white/20">
               Book a Consultation
             </button>
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

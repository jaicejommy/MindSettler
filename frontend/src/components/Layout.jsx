import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

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

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>

        <nav className={`nav-links ${isMobileMenuOpen ? 'nav-links-open' : ''}`}>
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

          {/* Admin login button */}
          <a href="/admin/login" onClick={closeMobileMenu}>
            <button type="button" className="nav-admin-btn">
              Login
            </button>
          </a>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <p className="brand-name">MindSettler</p>
          <p className="footer-tagline">Psycho-education &amp; mental well-being platform</p>
          <p className="footer-disclaimer">
            This website is for informational purposes only and is not a substitute for professional medical or
            psychiatric care.
          </p>
        </div>
        <div className="footer-section">
          <h4 className="footer-section-title">Policies</h4>
          <div className="footer-links">
            <a href="#policies">Privacy</a>
            <a href="#policies">Non-refund policy</a>
            <a href="#policies">Confidentiality</a>
          </div>
        </div>
        <div className="footer-section">
          <h4 className="footer-section-title">Connect</h4>
          <div className="footer-links">
            <a
              href="https://www.instagram.com/mindsettlerbypb/"
              target="_blank"
              rel="noreferrer"
              className="footer-social-link"
            >
              <span>Instagram</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} MindSettler by Parnika. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default function Layout({ children }) {
  return (
    <div className="app-root app-ready">
      <Header />
      {children}
      <Footer />
      <ChatbotWidget />
    </div>
  )
}

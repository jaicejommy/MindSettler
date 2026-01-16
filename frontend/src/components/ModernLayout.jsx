import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, MessageCircle, Heart, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import authedApi from '../authedApi'
import { listenToAuthChanges, logout } from '../firebase'

function NavigationBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [accountUser, setAccountUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifOpen, setNotifOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
          console.error('Failed to load user for navbar:', err)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setFirebaseUser(null)
      setAccountUser(null)
      setIsOpen(false)
      navigate('/')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Psycho-education', href: '/psycho-education' },
    { label: 'Journey', href: '/journey' },
    { label: 'Book a session', href: '/booking' },
    { label: 'Corporate', href: '/corporate' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled ? 'glass-nav py-3' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-screen-xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 group"
          type="button"
        >
          <div className="relative w-10 h-10 flex items-center justify-center bg-white/80 rounded-full shadow-lg backdrop-blur-sm group-hover:bg-white transition-colors">
            <Heart className="w-5 h-5 text-secondary-600 fill-primary-200 transition-transform duration-500 group-hover:scale-110" strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl font-bold text-secondary-900 leading-none tracking-tight drop-shadow-sm">
              MindSettler
            </span>
            <span className="text-[10px] text-primary-800 font-bold tracking-widest uppercase ml-0.5 opacity-80">
              By Parnika
            </span>
          </div>
        </button>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-1 bg-white/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/40 shadow-sm">
            {navLinks.map((link) => (
              <a 
                key={link.label} 
                href={link.href} 
                className="text-sm font-medium text-secondary-900 hover:text-primary-700 transition-colors px-3 py-1 rounded-full hover:bg-white/50"
              >
                {link.label}
              </a>
            ))}
          </div>
          {firebaseUser ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/auth')}
                className="text-sm font-medium text-secondary-900 hover:text-primary-700 transition-colors px-3 py-1"
              >
                Profile
              </button>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-secondary-900 hover:text-primary-700 transition-colors px-3 py-1"
              >
                Logout
              </button>
            </div>
          ) : (
            <button onClick={() => navigate('/auth')} className="bg-secondary-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-secondary-800 transition-all shadow-lg hover:shadow-primary-400/50 hover:-translate-y-0.5 flex items-center gap-2">
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-secondary-900 bg-white/50 p-2 rounded-full backdrop-blur-md"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl absolute top-full left-0 w-full border-b border-white/40"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-secondary-900 hover:text-primary-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-secondary-100 pt-4 mt-2">
                {firebaseUser ? (
                  <>
                    <button 
                      onClick={() => { navigate('/auth'); setIsOpen(false); }}
                      className="w-full text-left text-lg font-medium text-secondary-900 hover:text-primary-600 transition-colors py-2"
                      type="button"
                    >
                      Profile
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left text-lg font-medium text-secondary-900 hover:text-primary-600 transition-colors py-2"
                      type="button"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => { navigate('/auth'); setIsOpen(false); }}
                    className="w-full bg-secondary-900 text-white py-3 rounded-full font-medium hover:bg-secondary-800 transition-all"
                    type="button"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function ModernFooter() {
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
                <a 
                  key={social} 
                  href="https://www.instagram.com/mindsettlerbypb/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 transition-all duration-300 group"
                >
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
                <li key={item}>
                  <a href="#" className="text-secondary-300 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-bold text-lg mb-6 text-white">Support</h4>
            <ul className="space-y-4">
              {['Contact Us', 'FAQs', 'Privacy Policy', 'Terms of Service'].map(item => (
                <li key={item}>
                  <a href="#" className="text-secondary-300 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-bold text-lg mb-6 text-white">Get in touch</h4>
            <button className="w-full py-4 bg-white text-secondary-950 rounded-xl font-bold hover:bg-primary-50 transition-all mb-4 shadow-lg hover:shadow-white/20">
              Book a Session
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

export { NavigationBar, ModernFooter }

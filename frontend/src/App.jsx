import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './overrides.css'

import './scroll-animations.css'
import './reel.css'
import './no-step-labels.css'
import './fix-interactions.css'
import './carousel-reset.css'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import PsychoEducationPage from './pages/PsychoEducationPage'
import JourneyPage from './pages/JourneyPage'
import BookingPage from './pages/BookingPage'
import CorporatePage from './pages/CorporatePage'
import FAQsPage from './pages/FAQsPage'
import ContactPage from './pages/ContactPage'
import PrivacyPage from './pages/PrivacyPage'
import NonRefundPage from './pages/NonRefundPage'
import ConfidentialityPage from './pages/ConfidentialityPage'
import AuthPage from './pages/AuthPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ChatBot from './components/ChatBot'

function App() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  return (
    <>
      <div className={`app-root ${isReady ? 'app-ready' : ''}`}>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/psycho-education" element={<PsychoEducationPage />} />
            <Route path="/journey" element={<JourneyPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/corporate" element={<CorporatePage />} />
            <Route path="/faqs" element={<FAQsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/non-refund" element={<NonRefundPage />} />
            <Route path="/confidentiality" element={<ConfidentialityPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </Layout>
      </div>
      <ChatBot />
    </>
  )
}

export default App

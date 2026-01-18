import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './design-system.css'
import './overrides.css'
import './scroll-animations.css'
import './reel.css'
import './no-step-labels.css'
import './fix-interactions.css'
import './carousel-reset.css'
import Layout from './components/Layout'
import IntroPage from './pages/IntroPage'
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
import ArticlePage from './pages/ArticlePage'
import TherapiesPage from './pages/TherapiesPage'
import TherapyArticlePage from './pages/TherapyArticlePage'
import ChatBot from './components/ChatBot'

// Admin pages
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminForgotPasswordPage from './pages/admin/AdminForgotPasswordPage'
import AdminResetPasswordPage from './pages/admin/AdminResetPasswordPage'

// Protected route for admin dashboard
function AdminProtectedRoute({ children }) {
  const isAdminAuthed = Boolean(localStorage.getItem('mindsettler_admin_token'))
  return isAdminAuthed ? children : <Navigate to="/admin" replace />
}

function App() {
  const location = useLocation()
  const [isReady, setIsReady] = useState(false)
  const [showIntro, setShowIntro] = useState(() => {
    // Check if user has already seen the intro in this session
    return !sessionStorage.getItem('introViewed')
  })

  useEffect(() => {
    setIsReady(true)
  }, [])

  // Check sessionStorage whenever location changes
  useEffect(() => {
    const introViewed = sessionStorage.getItem('introViewed')
    setShowIntro(!introViewed)
  }, [location])

  return (
    <>
      <Routes>
        {/* Show intro on root if first time, otherwise show home */}
        <Route path="/" element={showIntro ? <IntroPage /> : <Layout><HomePage /></Layout>} />

        {/* Intro page - can also be accessed directly */}
        <Route path="/intro" element={<IntroPage />} />

        {/* All other pages */}
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/psycho-education" element={<Layout><PsychoEducationPage /></Layout>} />
        <Route path="/journey" element={<Layout><JourneyPage /></Layout>} />
        <Route path="/booking" element={<Layout><BookingPage /></Layout>} />
        <Route path="/corporate" element={<Layout><CorporatePage /></Layout>} />
        <Route path="/faqs" element={<Layout><FAQsPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
        <Route path="/non-refund" element={<Layout><NonRefundPage /></Layout>} />
        <Route path="/confidentiality" element={<Layout><ConfidentialityPage /></Layout>} />
        <Route path="/auth" element={<Layout><AuthPage /></Layout>} />
        <Route path="/reset-password" element={<Layout><ResetPasswordPage /></Layout>} />
        <Route path="/article/:slug" element={<Layout><ArticlePage /></Layout>} />
        <Route path="/therapies" element={<Layout><TherapiesPage /></Layout>} />
        <Route path="/therapy/:id" element={<Layout><TherapyArticlePage /></Layout>} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={
          <AdminProtectedRoute>
            <AdminDashboardPage />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/forgot-password" element={<AdminForgotPasswordPage />} />
        <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />
      </Routes>
      <ChatBot />
    </>
  )
}

export default App


import { Routes, Route } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import PsychoEducationPage from './pages/PsychoEducationPage'
import JourneyPage from './pages/JourneyPage'
import BookingPage from './pages/BookingPage'
import CorporatePage from './pages/CorporatePage'
import FAQsPage from './pages/FAQsPage'
import ContactPage from './pages/ContactPage'

function App() {
  return (
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
      </Routes>
    </Layout>
  )
}

export default App

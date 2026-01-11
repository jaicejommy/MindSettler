import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import './index.css'

function ProtectedRoute({ children }) {
  const isAdminAuthed = Boolean(localStorage.getItem('mindsettler_admin_token'))
  return isAdminAuthed ? children : <Navigate to="/" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      {/* Redirect any unknown routes to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App


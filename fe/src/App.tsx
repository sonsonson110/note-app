import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import NoteLayout from './components/NoteLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicRoute } from './components/PublicRoute'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './features/Login/LoginPage'
import SignupPage from './features/Signup/SignupPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path='/notes' element={<NoteLayout />}>
              <Route path=':noteId' element={<NoteLayout />} />
            </Route>
            <Route path='/' element={<Navigate to='/notes' replace />} />
          </Route>
          {/* Public routes - only accessible when not authenticated */}
          <Route element={<PublicRoute />}>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

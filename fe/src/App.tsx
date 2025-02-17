import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/Login/LoginPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NoteListPage } from './pages/NoteList/NoteListPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import SignupPage from './pages/Signup/SignupPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<NoteListPage />} />{' '}
          </Route>
          {/* Public routes */}
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

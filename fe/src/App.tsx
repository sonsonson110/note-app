import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/Login/LoginPage'

function App() {
  return (
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  )
}

export default App

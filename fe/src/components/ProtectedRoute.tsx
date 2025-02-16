import { Navigate, Outlet } from 'react-router-dom'
import { MainLayout } from './MainLayout'

export function ProtectedRoute() {
  const token = localStorage.getItem('accessToken')
  
  if (!token) {
    return <Navigate to="/login" replace />
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}
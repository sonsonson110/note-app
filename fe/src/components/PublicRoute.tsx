import { Navigate, Outlet } from 'react-router-dom'

export function PublicRoute() {
  const token = localStorage.getItem('accessToken')

  if (token) {
    return <Navigate to='/notes' replace />
  }

  return <Outlet />
}
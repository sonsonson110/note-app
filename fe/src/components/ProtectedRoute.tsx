import { Box } from '@mui/material'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CustomBackdrop from './CustomBackdrop'

export function ProtectedRoute() {
  const { loading, user } = useAuth()

  if (!user) {
    return <Navigate to='/login' replace />
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CustomBackdrop text='Logging out...' open={loading} />

      <Box
        component='main'
        sx={{
          flexGrow: 1
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

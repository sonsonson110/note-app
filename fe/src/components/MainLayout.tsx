import MenuIcon from '@mui/icons-material/Menu'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { AppBar, Backdrop, Box, IconButton, Toolbar, Typography } from '@mui/material'
import { useState } from 'react'
import TemporaryDrawer from './TemporaryDrawer'
import { useAuth } from '../context/AuthContext'
interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { loading } = useAuth()

  return (
    <Box sx={{ display: 'flex' }}>
      <Backdrop sx={(theme) => ({ color: '#ffffff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
        <Typography variant='h4' sx={{ fontWeight: 600 }}>
          Logging out...
        </Typography>
      </Backdrop>

      <AppBar position='fixed' elevation={0}>
        <Toolbar variant='dense'>
          <IconButton color='inherit' edge='start' onClick={() => setDrawerOpen(!drawerOpen)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Note App
          </Typography>
          <IconButton color='inherit' edge='end'>
            <NoteAddIcon />
          </IconButton>
        </Toolbar>

        <TemporaryDrawer drawerOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </AppBar>

      <Box
        component='main'
        sx={{
          flexGrow: 1
        }}
      >
        <Toolbar variant='dense' />
        {children}
      </Box>
    </Box>
  )
}

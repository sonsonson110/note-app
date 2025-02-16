import MenuIcon from '@mui/icons-material/Menu'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { AppBar, Box, Divider, IconButton, Toolbar, Typography } from '@mui/material'
import { useState } from 'react'
import TemporaryDrawer from './TemporaryDrawer'
interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex'}}>
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

        <Divider />

        <TemporaryDrawer drawerOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </AppBar>

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          mt: 4,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

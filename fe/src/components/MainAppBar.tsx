import { Box, Toolbar, IconButton, Typography, AppBar } from '@mui/material'
import TemporaryDrawer from './TemporaryDrawer'
import MenuIcon from '@mui/icons-material/Menu'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { useState } from 'react'

interface MainAppBarProps {
  onNoteInsert: () => void
}

export default function MainAppBar({ onNoteInsert }: MainAppBarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <AppBar position='static' elevation={0}>
        <Toolbar variant='dense'>
          <IconButton color='inherit' edge='start' onClick={() => setDrawerOpen(!drawerOpen)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Note App
          </Typography>
          <IconButton color='inherit' edge='end' onClick={onNoteInsert}>
            <NoteAddIcon />
          </IconButton>
        </Toolbar>

        <TemporaryDrawer drawerOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </AppBar>
    </Box>
  )
}

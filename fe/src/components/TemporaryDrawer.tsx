import { Drawer, Box, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import Filter1OutlinedIcon from '@mui/icons-material/Filter1Outlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuth } from '../context/AuthContext'

export interface TemporaryDrawerProps {
  drawerOpen: boolean
  onClose: () => void
}

export default function TemporaryDrawer({ drawerOpen, onClose }: TemporaryDrawerProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const menuItems = [
    { text: 'Notes', icon: <Filter1OutlinedIcon />, onClick: () => navigate('/') },
    { text: 'Trash', icon: <DeleteOutlineOutlinedIcon />, onClick: () => {} },
    { text: 'Setting', icon: <SettingsOutlinedIcon />, onClick: () => {} },
    { text: 'Logout', icon: <LogoutIcon />, onClick: logout }
  ]

  return (
    <Drawer open={drawerOpen} onClose={onClose}>
      <Box sx={{ width: 230 }} role='presentation'>
        <Toolbar variant='dense' />
        <Divider/>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={item.onClick}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

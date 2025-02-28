import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined'
import CloudOffOutlinedIcon from '@mui/icons-material/CloudOffOutlined'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import FirstPageOutlinedIcon from '@mui/icons-material/FirstPageOutlined'
import InfoIcon from '@mui/icons-material/Info'
import StartIcon from '@mui/icons-material/Start'
import {
  AppBar,
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@mui/material'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NoStyledTextField from '../../components/NoStyledTextField'
import { useNotes } from '../../context/NoteContext'
import { useViewport } from '../../hooks/useViewport'
import NoteInfoDialog from './components/NoteInfoDialog'

interface NoteDetailProps {
  noteId?: string | null
  isNoteListVisible: boolean
  onNoteListToggle: () => void
}

export default function NoteDetail({ noteId, isNoteListVisible, onNoteListToggle }: NoteDetailProps) {
  const {
    currentNote,
    detailLoading,
    noteSyncing,
    detailError,
    syncError,
    loadCurrentNote,
    deleteNote,
    updateCurrentNote
  } = useNotes()

  const { isMobile } = useViewport()
  const navigate = useNavigate()
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const noteLoaded = noteId && !detailLoading && !detailError

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleAppBarBack = () => {
    navigate('/notes')
  }

  const handleNoteDelete = async () => {
    handleMenuClose()
    if (noteId) {
      await deleteNote(noteId)
    }
    navigate('/notes')
  }

  useEffect(() => {
    if (noteId) {
      loadCurrentNote(noteId)
    }
  }, [noteId])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {isDialogVisible && <NoteInfoDialog note={currentNote!} onClose={() => setIsDialogVisible(false)} />}

      {noteId && (
        <AppBar position='sticky' elevation={0}>
          <Toolbar variant='dense'>
            {isMobile ? (
              <IconButton edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }} onClick={handleAppBarBack}>
                <ArrowBackIcon />
              </IconButton>
            ) : (
              <IconButton edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }} onClick={onNoteListToggle}>
                {isNoteListVisible ? <FirstPageOutlinedIcon /> : <StartIcon />}
              </IconButton>
            )}
            <Box sx={{ flexGrow: 1 }} />
            {noteLoaded && (
              <>
                {syncError && !noteSyncing && (
                  <Box gap={1} sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <Typography sx={{ fontSize: 13 }}>{syncError}</Typography>
                    <CloudOffOutlinedIcon />
                  </Box>
                )}
                {noteSyncing ? (
                  <CircularProgress sx={{ color: 'white', mr: 2 }} size={20} />
                ) : (
                  !syncError && (
                    <Box gap={1} sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <Typography sx={{ fontSize: 13 }}>
                        {format(currentNote.updatedAt, 'MMM d, yyyy, h:mm:ss.SSS a')}
                      </Typography>
                      <CloudDoneOutlinedIcon />
                    </Box>
                  )
                )}
                <IconButton color='inherit' edge='end' sx={{ mr: 0.75 }} onClick={() => setIsDialogVisible(true)}>
                  <InfoIcon />
                </IconButton>
                <IconButton color='inherit' edge='end' onClick={handleMenuClick}>
                  <ExpandCircleDownIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                  <MenuItem>
                    <ListItemText sx={{ pr: 4 }}>Pin to top</ListItemText>
                    <Checkbox />
                  </MenuItem>
                  <MenuItem disabled>History</MenuItem>
                  <Divider />
                  <MenuItem disabled>
                    <ListItemText>Publish</ListItemText>
                    <Checkbox />
                  </MenuItem>
                  <MenuItem disabled>Copy link</MenuItem>
                  <Divider />
                  <MenuItem onClick={handleNoteDelete} sx={{ color: 'error.main' }}>
                    Move to trash
                  </MenuItem>
                </Menu>
              </>
            )}
          </Toolbar>
        </AppBar>
      )}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          pl: 4,
          '&::-webkit-scrollbar': {
            width: '6px' // Thin scrollbar
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)', // Light color thumb
            borderRadius: '3px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)' // Lighter track
          }
        }}
      >
        {!noteLoaded ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {!noteId && <Typography color='text.secondary'>Select a note to view</Typography>}
            {detailLoading && <Typography color='text.secondary'>Loading...</Typography>}
            {detailError && <Typography color='text.secondary'>{detailError}</Typography>}
          </Box>
        ) : (
          <Box>
            <NoStyledTextField
              placeholder='Put a note title...'
              value={currentNote.title}
              onValueChange={(val) => {
                updateCurrentNote({ title: val })
              }}
              sx={{ typography: 'h5' }}
            />
            <Divider sx={{mt: 1, mb: 1}}/>
            <NoStyledTextField
              multiline
              placeholder='Write some content...'
              value={currentNote.content}
              onValueChange={(val) => {
                updateCurrentNote({ content: val })
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}

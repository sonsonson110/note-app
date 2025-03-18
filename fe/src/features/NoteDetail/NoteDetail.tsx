import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined'
import CloudOffOutlinedIcon from '@mui/icons-material/CloudOffOutlined'
import EditIcon from '@mui/icons-material/Edit'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import FirstPageOutlinedIcon from '@mui/icons-material/FirstPageOutlined'
import InfoIcon from '@mui/icons-material/Info'
import StartIcon from '@mui/icons-material/Start'
import VisibilityIcon from '@mui/icons-material/Visibility'
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
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useNavigate } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
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
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')
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

  const toggleViewMode = () => {
    setViewMode(viewMode === 'edit' ? 'preview' : 'edit')
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
                {/* Sync status */}
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
                {/* Markdown toggle */}
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={toggleViewMode}
                  size='small'
                  aria-label='markdown view mode'
                  sx={{
                    mr: 2,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    '& .MuiToggleButton-root': {
                      color: 'white',
                      border: 'none',
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(255,255,255,0.25)',
                        color: 'white'
                      }
                    }
                  }}
                >
                  <ToggleButton value='edit' aria-label='edit mode'>
                    <Tooltip title='Edit Raw Text'>
                      <EditIcon fontSize='small' />
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton value='preview' aria-label='preview mode'>
                    <Tooltip title='Preview Markdown'>
                      <VisibilityIcon fontSize='small' />
                    </Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup>
                {/* Metadata dialog */}
                <IconButton color='inherit' edge='end' sx={{ mr: 0.75 }} onClick={() => setIsDialogVisible(true)}>
                  <InfoIcon />
                </IconButton>
                {/* Note option menu */}
                <IconButton color='inherit' edge='end' onClick={handleMenuClick}>
                  <ExpandCircleDownIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                  <MenuItem onClick={() => updateCurrentNote({ pinned: !currentNote.pinned })}>
                    <ListItemText sx={{ pr: 4, zIndex: 2 }}>Pin to top</ListItemText>
                    <Checkbox checked={currentNote.pinned} sx={{ zIndex: 1, p: 0 }} size='small' />
                  </MenuItem>
                  <MenuItem disabled>
                    <ListItemText>Publish</ListItemText>
                    <Checkbox sx={{ zIndex: 1, p: 0 }} size='small' />
                  </MenuItem>
                  <Divider />
                  <MenuItem disabled>History</MenuItem>
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
            {viewMode === 'edit' ? (
              <NoStyledTextField
                multiline
                placeholder='Write some content...'
                value={currentNote.content}
                onValueChange={(val) => {
                  updateCurrentNote({ content: val })
                }}
              />
            ) : (
              <Box
                sx={{
                  fontFamily: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    'sans-serif',
                    '"Apple Color Emoji"',
                    '"Segoe UI Emoji"',
                    '"Segoe UI Symbol"'
                  ].join(','),
                  // Add custom styling for markdown content
                  '& p': {
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    marginBottom: '0.75rem'
                  },
                  '& h1': {
                    fontSize: '1.5rem',
                    fontWeight: 500,
                    lineHeight: 1.2,
                    marginBottom: '0.5rem',
                    marginTop: '0.75rem'
                  },
                  '& h2': {
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    lineHeight: 1.3,
                    marginBottom: '0.5rem',
                    marginTop: '0.75rem'
                  },
                  '& h3': {
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    lineHeight: 1.4,
                    marginBottom: '0.5rem',
                    marginTop: '0.75rem'
                  },
                  '& a': {
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  },
                  '& ul, & ol': {
                    marginBottom: '0.75rem',
                    paddingLeft: '1.5rem'
                  },
                  '& li': {
                    marginBottom: '0.25rem',
                    fontSize: '0.875rem'
                  },
                  '& code': {
                    fontFamily: 'Consolas, Monaco, monospace',
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    padding: '0.1rem 0.3rem',
                    borderRadius: '2px',
                    fontSize: '0.8rem'
                  },
                  '& pre': {
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    padding: '0.75rem',
                    borderRadius: '3px',
                    overflowX: 'auto',
                    marginBottom: '0.75rem',
                    '& code': {
                      backgroundColor: 'transparent',
                      padding: 0
                    }
                  },
                  '& blockquote': {
                    borderLeft: '3px solid rgba(0, 0, 0, 0.08)',
                    paddingLeft: '0.75rem',
                    margin: '0.75rem 0',
                    color: 'text.secondary',
                    fontSize: '0.875rem'
                  },
                  '& img': {
                    maxWidth: '100%',
                    height: 'auto'
                  },
                  '& hr': {
                    border: 'none',
                    height: '1px',
                    backgroundColor: 'rgba(0, 0, 0, 0.06)',
                    margin: '1rem 0'
                  },
                  '& table': {
                    borderCollapse: 'collapse',
                    width: '100%',
                    marginBottom: '0.75rem',
                    fontSize: '0.875rem'
                  },
                  '& th, & td': {
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    padding: '0.3rem 0.5rem'
                  },
                  '& th': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    fontWeight: 500
                  }
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentNote.content}</ReactMarkdown>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}

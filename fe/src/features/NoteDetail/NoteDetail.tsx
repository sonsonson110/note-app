import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import FirstPageOutlinedIcon from '@mui/icons-material/FirstPageOutlined'
import InfoIcon from '@mui/icons-material/Info'
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { httpErrorHandler } from '../../handlers/httpErrorHandler'
import { useViewport } from '../../hooks/useViewport'
import { NoteDetailRespDto } from '../../services/note/dto/noteDetailRespDto'
import { noteApi } from '../../services/note/noteApi'
import { ApiError } from '../../types/apiError'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import StartIcon from '@mui/icons-material/Start'
import NoStyledTextField from '../../components/NoStyledTextField'
import NoteInfoDialog from './components/NoteInfoDialog'

interface NoteDetailProps {
  noteId?: string | null
  isNoteListVisible: boolean
  onNoteListToggle: () => void
}

export default function NoteDetail({ noteId, isNoteListVisible, onNoteListToggle }: NoteDetailProps) {
  const { setIsAuthenticated } = useAuth()
  const { isMobile } = useViewport()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const noteLoaded = noteId && !loading && !error
  const [note, setNote] = useState<NoteDetailRespDto>({
    id: '',
    title: '',
    content: '',
    isPublic: false,
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  const handleBack = () => {
    navigate('/notes')
  }

  useEffect(() => {
    setLoading(true)
    if (!noteId) {
      setLoading(false)
      return
    }
    noteApi
      .getNote(noteId)
      .then((data) => {
        setNote(data)
        setLoading(false)
      })
      .catch((error) => {
        if (error.response) {
          const { status, data } = error.response
          httpErrorHandler({
            statusCode: status,
            errorObject: data as ApiError,
            context: { setIsAuthenticated }
          })
          setError(data.error.message)
          setLoading(false)
        }
      })
  }, [noteId])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {isDialogVisible && <NoteInfoDialog note={note} onClose={() => setIsDialogVisible(false)} />}

      {noteId && (
        <AppBar position='sticky' elevation={0}>
          <Toolbar variant='dense'>
            {isMobile ? (
              <IconButton edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }} onClick={handleBack}>
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
                <IconButton color='inherit' edge='end' sx={{ mr: 0.75 }} onClick={() => setIsDialogVisible(true)}>
                  <InfoIcon />
                </IconButton>
                <IconButton color='inherit' edge='end'>
                  <ExpandCircleDownIcon />
                </IconButton>
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
            {loading && <Typography color='text.secondary'>Loading...</Typography>}
            {error && <Typography color='text.secondary'>{error}</Typography>}
          </Box>
        ) : (
          <Box>
            <NoStyledTextField
              placeholder='Put a note title...'
              value={note.title}
              onValueChange={(val) => {
                setNote((prev) => ({ ...prev, title: val }))
              }}
              sx={{ typography: 'h5' }}
            />
            <NoStyledTextField
              multiline
              placeholder='Write some content...'
              value={note.content}
              onValueChange={(val) => {
                setNote((prev) => ({ ...prev, content: val }))
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}

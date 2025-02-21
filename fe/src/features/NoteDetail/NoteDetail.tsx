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

export default function NoteDetail({ noteId }: { noteId?: string | null }) {
  const { setIsAuthenticated } = useAuth()
  const { isMobile } = useViewport()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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
    <Box sx={{ height: '100%' }}>
      <AppBar position='static' elevation={0}>
        <Toolbar variant='dense'>
          {isMobile && (
            <IconButton edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }} onClick={handleBack}>
              <FirstPageOutlinedIcon />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color='inherit' edge='end' sx={{ mr: 0.75 }}>
            <InfoIcon />
          </IconButton>
          <IconButton color='inherit' edge='end'>
            <ExpandCircleDownIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        {loading || error || !noteId ? (
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
          <>
            <Typography variant='h4' sx={{ mb: 2 }}>
              {note.title}
            </Typography>
            <Typography>{note.content}</Typography>
          </>
        )}
      </Box>
    </Box>
  )
}

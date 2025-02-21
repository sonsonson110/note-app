import { Box, Divider, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import { memo, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MainAppBar from '../../components/MainAppBar'
import { useAuth } from '../../context/AuthContext'
import { httpErrorHandler } from '../../handlers/httpErrorHandler'
import { NoteListItemDto } from '../../services/note/dto/noteListItemDto'
import { noteApi } from '../../services/note/noteApi'
import { ApiError } from '../../types/apiError'
import { PageMetaDto } from '../../types/pageDto'

interface NoteItemProps {
  item: NoteListItemDto
  isSelected: boolean
  onNoteClick: (noteId: string) => void
}

const NoteItem = memo(({ item, isSelected, onNoteClick }: NoteItemProps) => (
  <>
    <ListItem
      disablePadding
      sx={{ height: '56px' }}
    >
      <ListItemButton sx={{ height: '100%' }} onClick={() => onNoteClick(item.id)}>
        <ListItemText
          primary={item.title || 'Untitled'}
          secondary={item.content}
          sx={{
            '& .MuiTypography-root': {
              fontWeight: isSelected ? 600 : 400
            },
            '& .MuiListItemText-secondary': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              lineHeight: '20px',
              fontSize: '0.75rem',
            }
          }}
        />
      </ListItemButton>
    </ListItem>
    <Divider />
  </>
))

NoteItem.displayName = 'NoteItem'

export function NoteList({}) {
  const [loading, setLoading] = useState(false)
  const [noteListItems, setNoteListItem] = useState<NoteListItemDto[]>([])
  const [error, setError] = useState('')
  const pageMetaRef = useRef<PageMetaDto>(null)

  const { setIsAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { noteId } = useParams()

  async function loadData() {
    try {
      setLoading(true)
      setError('')
      const { items, meta } = await noteApi.getNotes()
      setNoteListItem(items)
      pageMetaRef.current = meta
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response
        httpErrorHandler({
          statusCode: status,
          errorObject: data as ApiError,
          context: { setIsAuthenticated }
        })
        setError(data.message)
      } else {
        setError('Failed to load notes')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleNoteClick = (noteId: string) => {
    navigate(`/notes/${noteId}`)
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: 1,
        borderColor: 'divider'
      }}
    >
      <MainAppBar />
      {error && <Typography sx={{ p: 2, color: 'error.main' }}>{error}</Typography>}
      {loading ? (
        <Typography sx={{p: 1}}>Loading...</Typography>
      ) : (
        <List sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
          {noteListItems.map((item) => (
            <NoteItem
              key={item.id}
              item={item}
              isSelected={noteId === item.id}
              onNoteClick={() => handleNoteClick(item.id)}
            />
          ))}
        </List>
      )}
    </Box>
  )
}

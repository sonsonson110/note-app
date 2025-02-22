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
import NoStyledTextField from '../../components/NoStyledTextField'
import { Search } from '@mui/icons-material'

interface NoteItemProps {
  item: NoteListItemDto
  isSelected: boolean
  onNoteClick: (noteId: string) => void
}

const NoteItem = memo(({ item, isSelected, onNoteClick }: NoteItemProps) => (
  <>
    <ListItem disablePadding sx={{ height: '56px' }}>
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
              fontSize: '0.75rem'
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
  const [searchText, setSearchText] = useState('')
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
        <Typography sx={{ p: 1 }}>Loading...</Typography>
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <NoStyledTextField
            value={searchText}
            onValueChange={(newValue) => {
              setSearchText(newValue)
            }}
            placeholder='Search all notes'
            containerSx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}
            sx={{ typography: 'body2' }}
            leadingIcon={Search}
          />
          <List
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 0,
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
            {noteListItems.map((item) => (
              <NoteItem
                key={item.id}
                item={item}
                isSelected={noteId === item.id}
                onNoteClick={() => handleNoteClick(item.id)}
              />
            ))}
          </List>
        </Box>
      )}
    </Box>
  )
}

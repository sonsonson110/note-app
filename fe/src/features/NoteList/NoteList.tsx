import { Refresh, Search } from '@mui/icons-material'
import PushPinIcon from '@mui/icons-material/PushPin'
import { Box, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material'
import { memo, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MainAppBar from '../../components/MainAppBar'
import NoStyledTextField from '../../components/NoStyledTextField'
import { useNotes } from '../../context/NoteContext'
import { NoteListItemDto } from '../../services/note/dto/noteListItemDto'

interface NoteItemProps {
  item: NoteListItemDto
  isSelected: boolean
  onNoteClick: (noteId: string) => void
}

const NoteItem = memo(({ item, isSelected, onNoteClick }: NoteItemProps) => (
  <>
    <ListItem disablePadding>
      <ListItemButton sx={{ height: '100%' }} onClick={() => onNoteClick(item.id)}>
        {item.pinned && (
          <ListItemIcon sx={{ minWidth: 32 }}>
            <PushPinIcon color='primary' fontSize='small' />
          </ListItemIcon>
        )}
        <ListItemText
          primary={item.title || 'Untitled'}
          secondary={item.content}
          sx={{
            '& .MuiTypography-root': {
              fontWeight: isSelected ? 600 : 400
            },
            '& .MuiListItemText-primary': {
              color: isSelected ? (theme) => theme.palette.primary.main : 'inherit'
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

export function NoteList({}) {
  const { notes, listLoading, listError, loadNotes, insertNote } = useNotes()

  const [searchText, setSearchText] = useState('')

  const navigate = useNavigate()
  const { noteId } = useParams()

  useEffect(() => {
    loadNotes()
  }, [])

  const handleNoteClick = (noteId: string) => {
    navigate(`/notes/${noteId}`)
  }

  const handleNoteInsert = async () => {
    const newNoteId = await insertNote()
    if (newNoteId) {
      navigate(`/notes/${newNoteId}`)
    }
  }

  const handleRefresh = () => {
    loadNotes(true)
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
      <MainAppBar onNoteInsert={handleNoteInsert} />
      {listLoading ? (
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
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            px: 2, 
            py: 1, 
            borderBottom: 1, 
            borderColor: 'divider' 
          }}>
            <NoStyledTextField
              value={searchText}
              onValueChange={(newValue) => {
                setSearchText(newValue)
              }}
              placeholder='Search all notes'
              containerSx={{ flexGrow: 1 }}
              sx={{ typography: 'body2' }}
              leadingIcon={Search}
            />
            <Tooltip title="Refresh notes">
              <IconButton 
                size="small" 
                onClick={handleRefresh} 
                sx={{ ml: 1 }}
                disabled={listLoading}
              >
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          {listError && <Typography sx={{ p: 2, color: 'error.main' }}>{listError}</Typography>}

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
            {notes.map((item) => (
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

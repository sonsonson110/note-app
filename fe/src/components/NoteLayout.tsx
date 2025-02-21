import { Box } from '@mui/material'
import { useParams } from 'react-router-dom'
import NoteDetail from '../features/NoteDetail/NoteDetail'
import { NoteList } from '../features/NoteList/NoteList'
import { useViewport } from '../hooks/useViewport'

const NoteLayout = () => {
  const { isMobile } = useViewport()
  const { noteId } = useParams()

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Show NoteList if we're on desktop OR on mobile with no noteId selected */}
      {(!isMobile || !noteId) && (
        <Box
          sx={{
            width: isMobile ? '100%' : 300,
            flexShrink: 0
          }}
        >
          <NoteList />
        </Box>
      )}

      {/* Show NoteDetail if we're on desktop OR on mobile with noteId selected */}
      {(!isMobile || noteId) && (
        <Box
          sx={{
            flexGrow: 1,
            width: isMobile ? '100%' : 'auto'
          }}
        >
          <NoteDetail noteId={noteId}/>
        </Box>
      )}
    </Box>
  )
}

export default NoteLayout

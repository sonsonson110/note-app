import { Box } from '@mui/material'
import { useParams } from 'react-router-dom'
import NoteDetail from '../features/NoteDetail/NoteDetail'
import { NoteList } from '../features/NoteList/NoteList'
import { useViewport } from '../hooks/useViewport'
import { useState } from 'react'

const NoteLayout = () => {
  const { isMobile } = useViewport()
  const { noteId } = useParams()
  const [isListVisible, setIsListVisible] = useState(true)

  const handleToggleList = () => {
    setIsListVisible((prev) => !prev)
  }

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Show NoteList if we're on desktop (and visibility enabled) OR on mobile with no noteId selected */}
      {((!isMobile && isListVisible) || (isMobile && !noteId)) && (
        <Box
          sx={{
            width: isMobile ? '100%' : 300,
            flexShrink: 0,
            overflow: 'hidden'
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
            width: isMobile ? '100%' : 'auto',
            overflow: 'hidden'
          }}
        >
          <NoteDetail noteId={noteId} isNoteListVisible={isListVisible} onNoteListToggle={handleToggleList} />
        </Box>
      )}
    </Box>
  )
}

export default NoteLayout

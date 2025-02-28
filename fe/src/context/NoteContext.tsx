import { createContext, ReactNode, useCallback, useContext, useState } from 'react'
import { httpErrorHandler } from '../handlers/httpErrorHandler'
import { NoteDetailRespDto } from '../services/note/dto/noteDetailRespDto'
import { NoteListItemDto } from '../services/note/dto/noteListItemDto'
import { noteApi } from '../services/note/noteApi'
import { ApiError } from '../types/apiError'
import { useAuth } from './AuthContext'
import { debounce } from '@mui/material'
import { UpsertNoteReqDto } from '../services/note/dto/upsertNoteReqDto'
import { AxiosError } from 'axios'

interface NoteContextType {
  notes: NoteListItemDto[]
  listLoading: boolean
  detailLoading: boolean
  noteSyncing: boolean
  listError: string
  detailError: string
  syncError: string
  loadNotes: () => Promise<void>
  insertNote: () => Promise<string | undefined>
  deleteNote: (noteId: string) => Promise<void>
  currentNote: NoteDetailRespDto
  loadCurrentNote: (noteId: string) => Promise<void>
  updateCurrentNote: (note: Partial<NoteDetailRespDto>) => void
}

const NoteContext = createContext<NoteContextType | undefined>(undefined)

export function NoteProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<NoteListItemDto[]>([])
  const [listLoading, setListLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [listError, setListError] = useState('')
  const [detailError, setDetailError] = useState('')
  const [noteSyncing, setNoteSyncing] = useState(false)
  const [syncError, setSyncError] = useState('')
  const [currentNote, setCurrentNote] = useState<NoteDetailRespDto>({
    id: '',
    title: '',
    content: '',
    isPublic: false,
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  const { setIsAuthenticated } = useAuth()

  const loadNotes = async () => {
    try {
      setListLoading(true)
      setListError('')
      const { items } = await noteApi.getNotes()
      setNotes(items)
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        setListError('Something wrong happened')
      } else {
        const { status, data } = error.response!
        httpErrorHandler({
          statusCode: status,
          errorObject: data as ApiError,
          context: { setIsAuthenticated }
        })
        setListError(data.error.message ?? error.message)
      }
    } finally {
      setListLoading(false)
    }
  }

  const insertNote = async () => {
    try {
      const newNoteListItem = await noteApi.upsertNote({})
      setNotes((prev) => [newNoteListItem, ...prev])
      return newNoteListItem.id
    } catch (error: any) {
      if (!(error instanceof AxiosError)) {
        setDetailError('Something wrong happened')
      } else {
        const { status, data } = error.response!
        httpErrorHandler({
          statusCode: status,
          errorObject: data as ApiError,
          context: { setIsAuthenticated }
        })
        setDetailError(data.error.message ?? error.message)
      }
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      await noteApi.deleteNote(noteId)
      setNotes((prev) => prev.filter((note) => note.id !== noteId))
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        setDetailError('Something wrong happened')
      } else {
        const { status, data } = error.response!
        httpErrorHandler({
          statusCode: status,
          errorObject: data as ApiError,
          context: { setIsAuthenticated }
        })
        setDetailError(data.error.message ?? error.message)
      }
    }
  }

  const loadCurrentNote = async (noteId: string) => {
    try {
      setDetailLoading(true)
      setDetailError('')
      const data = await noteApi.getNote(noteId)
      setCurrentNote(data)
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        setDetailError('Something wrong happened')
      } else {
        const { status, data } = error.response!
        httpErrorHandler({
          statusCode: status,
          errorObject: data as ApiError,
          context: { setIsAuthenticated }
        })
        setDetailError(data.error.message ?? error.message)
      }
    } finally {
      setDetailLoading(false)
    }
  }

  const saveNote = async (req: UpsertNoteReqDto) => {
    try {
      const data = await noteApi.upsertNote(req)
      setCurrentNote((prev) => ({ ...prev, updatedAt: data.updatedAt }))
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        setSyncError('Something wrong happened')
      } else {
        const { status, data } = error.response!
        httpErrorHandler({
          statusCode: status,
          errorObject: data as ApiError,
          context: { setIsAuthenticated }
        })
        setSyncError(data.error.message ?? error.message)
      }
    } finally {
      setNoteSyncing(false)
    }
  }

  const debouncedSave = useCallback(
    debounce(async (req: UpsertNoteReqDto) => {
      await saveNote(req)
    }, 1500),
    []
  )

  const updateCurrentNote = (note: Partial<NoteDetailRespDto>) => {
    setCurrentNote((prev) => ({ ...prev, ...note }))
    // Set syncing status immediately
    setNoteSyncing(true)
    // also update the note list item title and content to reflect changes
    if (note.title || note.content) {
      setNotes((prevNotes) => {
        const noteIndex = prevNotes.findIndex((listItem) => listItem.id === currentNote.id)
        if (noteIndex === -1) return prevNotes

        const updatedNote = { ...prevNotes[noteIndex] }
        const updatedNotes = prevNotes.filter((note) => note.id !== updatedNote.id)

        // Update title if provided
        if (note.title) {
          updatedNote.title = note.title
        }

        // Update content if provided
        if (note.content) {
          updatedNote.content = note.content.length >= 100 ? note.content.substring(0, 100) + '...' : note.content
        }

        // Add it to the beginning of the array
        updatedNotes.unshift(updatedNote)

        return updatedNotes
      })
    }
    debouncedSave(currentNote)
  }

  const value = {
    notes,
    listLoading,
    detailLoading,
    noteSyncing,
    listError,
    detailError,
    syncError,
    loadNotes,
    insertNote,
    deleteNote,
    currentNote,
    loadCurrentNote,
    updateCurrentNote
  }

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>
}

export function useNotes() {
  const context = useContext(NoteContext)
  if (context === undefined) {
    throw new Error('useNotes must be used within a NoteProvider')
  }
  return context
}

import { Box, Chip, InputBase, Stack } from '@mui/material'
import { AxiosError } from 'axios'
import { JSX, KeyboardEvent, useEffect, useState } from 'react'
import { httpErrorHandler } from '../../../handlers/httpErrorHandler'
import { tagApi } from '../../../services/tag/tagApi'
import { ApiError } from '../../../types/apiError'

interface TagInputProps {
  noteId: string
}

export default function TagInput({ noteId }: TagInputProps): JSX.Element {
  const [tags, setTags] = useState<{ id: string; name: string }[]>([])
  const [inputValue, setInputValue] = useState('')

  // Load tags when component mounts
  useEffect(() => {
    const loadTags = async () => {
      try {
        if (noteId) {
          const fetchedTags = await tagApi.getTagsByNoteId(noteId)
          setTags(fetchedTags)
        }
      } catch (error: any) {
        if (!(error instanceof AxiosError)) {
          const { status, data } = error.response!
          httpErrorHandler({
            statusCode: status,
            errorObject: data as ApiError
          })
        }
      }
    }

    loadTags()
  }, [noteId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    // Create tag on space, Enter, or comma
    if ([' ', 'Enter', ','].includes(e.key) && inputValue.trim()) {
      e.preventDefault()

      const tagName = inputValue.trim()

      // Don't add duplicate tags
      if (!tags.map((tag) => tag.name).includes(tagName)) {
        try {
          const { createdAt, ...rest } = await tagApi.createTag({ tagName, noteId })
          setTags([...tags, rest])
        } catch (error: any) {
          if (!(error instanceof AxiosError)) {
            const { status, data } = error.response!
            httpErrorHandler({
              statusCode: status,
              errorObject: data as ApiError
            })
          }
        }
        setInputValue('')
      }
    }
  }

  const handleDeleteTag = async (tagId: string) => {
    try {
      await tagApi.deleteTag(noteId, tagId)
      setTags(tags.filter((tag) => tag.id !== tagId))
    } catch (error: any) {
      if (!(error instanceof AxiosError)) {
        const { status, data } = error.response!
        httpErrorHandler({
          statusCode: status,
          errorObject: data as ApiError
        })
      }
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 1,
        pt: 2
      }}
    >
      <Stack direction='row' spacing={1} sx={{ flexWrap: 'wrap' }}>
        {tags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.name}
            size='medium'
            sx={{
              fontSize: '1rem',
              '& .MuiChip-deleteIcon': {
                display: 'none'
              },
              '&:hover .MuiChip-deleteIcon': {
                display: 'flex'
              }
            }}
            onDelete={() => handleDeleteTag(tag.id)}
          />
        ))}
      </Stack>
      <InputBase
        placeholder='Add tags...'
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        sx={{
          flexGrow: 1
        }}
      />
    </Box>
  )
}

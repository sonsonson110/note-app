import { axiosInstance } from '../../lib/axios'
import { CreateTagReqDto } from './dto/createTagReqDto'

export const tagApi = {
  getTagsByNoteId: async (noteId: string): Promise<{id: string, name: string}[]> => {
    const { data } = await axiosInstance.get(`api/tags/notes/${noteId}`)
    return data
  },
  createTag: async (dto: CreateTagReqDto): Promise<{ id: string; name: string; createdAt: Date }> => {
    const { data } = await axiosInstance.post('/api/tags', dto)
    return data
  },
  deleteTag: async (noteId: string, tagId: string) => {
    await axiosInstance.delete(`api/tags/${tagId}/notes/${noteId}`)
  }
}

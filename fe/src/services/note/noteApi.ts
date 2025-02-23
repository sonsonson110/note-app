import { axiosInstance } from "../../lib/axios"
import { PageDto } from "../../types/pageDto"
import { NoteDetailRespDto } from "./dto/noteDetailRespDto"
import { NoteListItemDto } from "./dto/noteListItemDto"
import { UpsertNoteReqDto } from "./dto/upsertNoteReqDto"

export const noteApi = {
    getNotes: async (page: number = 1, limit: number = 10): Promise<PageDto<NoteListItemDto>> => {
        const {data} = await axiosInstance.get('api/notes', {params: {page, limit}})
        return data
    },

    getNote: async (noteId: string): Promise<NoteDetailRespDto> => {
        const {data} = await axiosInstance.get(`api/notes/${noteId}`)
        return data
    },

    upsertNote: async (dto: UpsertNoteReqDto): Promise<NoteDetailRespDto> => {
        const {data} = await axiosInstance.post('/api/notes', dto)
        return data
    },

    deleteNote: async (noteId: string) => {
        await axiosInstance.delete(`api/notes/${noteId}`)
    }
}
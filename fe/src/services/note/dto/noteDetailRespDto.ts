export interface NoteDetailRespDto {
    id: string
    title: string
    content: string
    isPublic: boolean
    version: number
    createdAt: Date
    updatedAt: Date
    pinned: boolean
}
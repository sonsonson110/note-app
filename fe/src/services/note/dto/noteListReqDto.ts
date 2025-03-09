export interface NoteListReqDto {
    page?: number
    limit?: number
    pinned?: boolean
    isDeleted?: boolean
}
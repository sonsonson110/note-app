export interface UpsertNoteReqDto {
    id?: string
    title?: string
    content?: string
    isPublic?: boolean,
    version?: number
    pinned?: boolean
}
export class NoteDetailRespDto {
    id!: string
    title!: string | null
    content!: string | null
    isPublic!: boolean
    version!: number
    createdAt!: Date
    updatedAt!: Date
    pinned: boolean = false
}
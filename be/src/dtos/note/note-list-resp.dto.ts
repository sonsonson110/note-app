import { PageDto } from '../common/page.dto'
import { PageMetaDto } from '../common/page-meta.dto'

export class NoteListRespDto extends PageDto<NoteListItemDto> {
    constructor(notes: NoteListItemDto[], meta: PageMetaDto) {
        super(notes, meta)
    }
}

export class NoteListItemDto {
    id!: string
    title!: string
    content!: string
    createdAt!: Date
    updatedAt!: Date
    pinned: boolean = false
}

import { BaseService } from './abstractions/base.service'
import { UpsertNoteReqDto } from '../dtos/note/upsert-note-req.dto'
import { AccessJwtPayload } from '../utils/jwt-helper.util'
import { v4 as uuidv4 } from 'uuid'
import { PageOptionsDto } from '../dtos/common/page-options.dto'
import { NoteListRespDto } from '../dtos/note/note-list-resp.dto'
import { PageMetaDto } from '../dtos/common/page-meta.dto'
import { NoteDetailRespDto } from '../dtos/note/note-detail-resp.dto'
import { plainToClass } from 'class-transformer'
import { NotFoundError } from '../types/errors.type'
import { getUserNoteList } from '@prisma/client/sql'

export class NoteService extends BaseService {
    private async noteExisted(
        noteId: string,
        userId: string
    ): Promise<boolean> {
        return (
            (await this.prisma.note.count({ where: { id: noteId, userId } })) >
            0
        )
    }

    async upsertNote(
        dto: UpsertNoteReqDto,
        userObj: AccessJwtPayload
    ): Promise<NoteDetailRespDto> {
        const entityData = { ...dto, userId: userObj.sub }
        if (!dto.id) {
            entityData.id = uuidv4()
            await this.prisma.note.create({ data: entityData })
        } else {
            if (!(await this.noteExisted(entityData.id!, entityData.userId))) {
                throw new NotFoundError('Requested note not found!')
            }
            await this.prisma.note.update({
                where: { id: entityData.id },
                data: entityData,
            })
        }
        const result = plainToClass(NoteDetailRespDto, entityData)
        return result
    }

    async getNotes(
        options: PageOptionsDto,
        userObj: AccessJwtPayload
    ): Promise<NoteListRespDto> {
        const [rawNotes, totalNotes] = await this.prisma.$transaction([
            this.prisma.$queryRawTyped(getUserNoteList(userObj.sub, options.skip, options.limit)),
            this.prisma.note.count({ where: { userId: userObj.sub } }),
        ])

        const pagingNotes = rawNotes.map(note => ({
            id: note.id,
            title: note.title,
            content: note.content ?? '', // Prisma typesql limitation
            createdAt: note.createdAt,
            updatedAt: note.updatedAt
        }));

        return new NoteListRespDto(
            pagingNotes,
            new PageMetaDto(options, totalNotes)
        )
    }

    async getNote(noteId: string, userObj: AccessJwtPayload): Promise<NoteDetailRespDto> {
        const result: NoteDetailRespDto | null = await this.prisma.note.findFirst({
            where: {id: noteId, userId: userObj.sub}
        })
        if (!result)
            throw new NotFoundError(`Requested note ${noteId} wasn't found!`)
        return result
    }

    async deleteNote(noteId: string, userObj: AccessJwtPayload) {
        await this.prisma.note.deleteMany({
            where: {
                id: noteId,
                userId: userObj.sub,
            },
        })
    }
}

export default new NoteService()

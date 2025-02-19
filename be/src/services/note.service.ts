import { BaseService } from './abstractions/base.service'
import { UpsertNoteReqDto } from '../dtos/note/upsert-note-req.dto'
import { AccessJwtPayload } from '../utils/jwt-helper.util'
import { v4 as uuidv4 } from 'uuid'
import { PageOptionsDto } from '../dtos/common/page-options.dto'
import { NoteListRespDto } from '../dtos/note/note-list-resp.dto'
import { PageMetaDto } from '../dtos/common/page-meta.dto'
import { NoteDto } from '../dtos/note/note.dto'
import { plainToClass } from 'class-transformer'
import { NotFoundError } from '../types/errors.type'

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
    ): Promise<NoteDto> {
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
        const result = plainToClass(NoteDto, entityData)
        return result
    }

    async getNotes(
        options: PageOptionsDto,
        userObj: AccessJwtPayload
    ): Promise<NoteListRespDto> {
        const [pagingNotes, totalNotes] = await this.prisma.$transaction([
            this.prisma.note.findMany({
                skip: options.skip,
                take: options.limit,
                where: { userId: userObj.sub },
                orderBy: { updatedAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    createdAt: true,
                    updatedAt: true,
                    isPublic: true,
                    version: true,
                },
            }),
            this.prisma.note.count({ where: { userId: userObj.sub } }),
        ])

        return new NoteListRespDto(
            pagingNotes,
            new PageMetaDto(options, totalNotes)
        )
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

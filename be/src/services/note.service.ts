import { BaseService } from './abstractions/base.service'
import { UpsertNoteReqDto } from '../dtos/note/upsert-note-req.dto'
import { AccessJwtPayload } from '../utils/jwt-helper.util'
import { v4 as uuidv4 } from 'uuid'
import { NoteListRespDto } from '../dtos/note/note-list-resp.dto'
import { PageMetaDto } from '../dtos/common/page-meta.dto'
import { NoteDetailRespDto } from '../dtos/note/note-detail-resp.dto'
import { plainToClass } from 'class-transformer'
import { NotFoundError } from '../types/errors.type'
import { getUserNoteList } from '@prisma/client/sql'
import { NoteListReqDto } from '../dtos/note/note-list-req.dto'

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
        let result
        if (!dto.id) {
            result = await this.prisma.note.create({
                data: { ...entityData, id: uuidv4() },
            })
        } else {
            if (!(await this.noteExisted(entityData.id!, entityData.userId))) {
                throw new NotFoundError('Requested note not found!')
            }
            result = await this.prisma.note.update({
                where: { id: entityData.id },
                data: entityData,
            })
        }
        return plainToClass(NoteDetailRespDto, result)
    }

    async getNotes(
        options: NoteListReqDto,
        userObj: AccessJwtPayload
    ): Promise<NoteListRespDto> {
        const [rawNotes, totalNotes] = await this.prisma.$transaction([
            this.prisma.$queryRawTyped(
                getUserNoteList(
                    userObj.sub,
                    options.skip,
                    options.limit,
                    options.pinned,
                    options.isDeleted
                )
            ),
            this.prisma.note.count({ where: { userId: userObj.sub } }),
        ])

        const pagingNotes = rawNotes.map((note) => ({
            id: note.id,
            title: note.title,
            content: note.content ?? '', // Prisma typesql limitation
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
            pinned: note.pinned,
        }))

        return new NoteListRespDto(
            pagingNotes,
            new PageMetaDto(options, totalNotes)
        )
    }

    async getNote(
        noteId: string,
        userObj: AccessJwtPayload
    ): Promise<NoteDetailRespDto> {
        const result: NoteDetailRespDto | null =
            await this.prisma.note.findFirst({
                where: { id: noteId, userId: userObj.sub, isDeleted: false },
            })
        if (!result)
            throw new NotFoundError(`Requested note ${noteId} wasn't found!`)
        return result
    }

    async deleteNote(noteId: string, userObj: AccessJwtPayload) {
        const updateResult = await this.prisma.note.updateMany({
            where: { id: noteId, userId: userObj.sub },
            data: { isDeleted: true },
        })

        if (updateResult.count === 0) {
            throw new NotFoundError(
                `Requested note ${noteId} wasn't found or is already deleted!`
            )
        }

        return
    }
}

export default new NoteService()

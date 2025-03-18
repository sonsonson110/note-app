import noteService, { NoteService } from '../services/note.service'
import { NextFunction, Request, Response } from 'express'
import { UpsertNoteReqDto } from '../dtos/note/upsert-note-req.dto'
import { PageOptionsDto } from '../dtos/common/page-options.dto'
import { plainToInstance } from 'class-transformer'
import { NotFoundError } from '../types/errors.type'
import { NoteListRespDto } from '../dtos/note/note-list-resp.dto'
import { NoteListReqDto } from '../dtos/note/note-list-req.dto'

export class NoteController {
    constructor(private readonly noteService: NoteService) {}

    async upsertNote(req: Request, resp: Response, next: NextFunction) {
        try {
            const dto: UpsertNoteReqDto = plainToInstance(
                UpsertNoteReqDto,
                req.body,
                {
                    excludeExtraneousValues: true,
                    enableImplicitConversion: true,
                    exposeDefaultValues: true,
                }
            )
            const result = await this.noteService.upsertNote(dto, req.user!)
            resp.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getNotes(req: Request, resp: Response, next: NextFunction) {
        try {
            const options = plainToInstance(NoteListReqDto, req.query, {
                enableImplicitConversion: true,
            })
            const result = await this.noteService.getNotes(options, req.user!)
            resp.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getNote(req: Request, resp: Response, next: NextFunction) {
        try {
            const { noteId } = req.params
            const result = await this.noteService.getNote(noteId, req.user!)
            resp.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async deleteNote(req: Request, resp: Response, next: NextFunction) {
        try {
            const { noteId } = req.params
            await this.noteService.deleteNote(noteId, req.user!)
            resp.status(204).json()
        } catch (error) {
            next(error)
        }
    }
}

export default new NoteController(noteService)

import { plainToInstance } from 'class-transformer'
import { NextFunction, Request, Response } from 'express'
import { CreateTagReqDto } from '../dtos/tag/create-tag-req.dto'
import tagService, { TagService } from '../services/tag.service'
import { AccessJwtPayload } from '../utils/jwt-helper.util'

export class TagController {
    constructor(private readonly tagService: TagService) {}

    async getTagsByNoteId(req: Request, res: Response, next: NextFunction) {
        try {
            const { noteId } = req.params
            const tags = await this.tagService.getTagsByNoteId(noteId)
            res.status(200).json(tags)
        } catch (error) {
            next(error)
        }
    }

    async createTag(req: Request, res: Response, next: NextFunction) {
        try {
            // Extract data from request body
            const dto = plainToInstance(CreateTagReqDto, req.body)

            // Get user data from JWT token
            const user = req.user as AccessJwtPayload

            // Create tag and associate with note
            const tag = await this.tagService.createTagAndAttachToNote(
                dto,
                user
            )

            res.status(201).json(tag)
        } catch (error) {
            next(error)
        }
    }

    async removeTag(req: Request, res: Response, next: NextFunction) {
        try {
            // Extract parameters
            const { noteId, tagId } = req.params
            const user = req.user as AccessJwtPayload

            // Remove tag from note
            await this.tagService.removeTagFromNote(noteId, tagId, user)

            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}

export default new TagController(tagService)

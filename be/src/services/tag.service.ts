import { CreateTagReqDto } from '../dtos/tag/create-tag-req.dto'
import { NotFoundError, ValidationError } from '../types/errors.type'
import { AccessJwtPayload } from '../utils/jwt-helper.util'
import { BaseService } from './abstractions/base.service'
import { v4 as uuidv4 } from 'uuid'

export class TagService extends BaseService {
    /**
     * Get all tags for a specific note
     */
    async getTagsByNoteId(
        noteId: string
    ): Promise<{ id: string; name: string }[]> {
        // Check if note exists first
        const noteExists = await this.prisma.note.findUnique({
            where: { id: noteId },
        })

        if (!noteExists) {
            throw new NotFoundError(`Note with id ${noteId} not found`)
        }

        // Get all tags associated with the note
        const tags = await this.prisma.tag.findMany({
            where: { noteId },
            select: {
                id: true,
                name: true,
            },
        })

        return tags
    }

    /**
     * Create tag and attach to a note
     */
    async createTagAndAttachToNote(
        dto: CreateTagReqDto,
        userObj: AccessJwtPayload
    ): Promise<{ id: string; name: string; createdAt: Date }> {
        // Check if note exists and belongs to user
        const note = await this.prisma.note.findFirst({
            where: {
                id: dto.noteId,
                userId: userObj.sub,
            },
        })

        if (!note) {
            throw new NotFoundError(
                `Note with id ${dto.noteId} not found or you don't have access to it`
            )
        }

        // Check if a tag with the same name already exists for the note
        const existingTag = await this.prisma.tag.findFirst({
            where: {
                noteId: dto.noteId,
                name: dto.tagName,
            },
        })

        if (existingTag) {
            throw new ValidationError(
                `Tag with name "${dto.tagName}" already exists for this note`
            )
        }

        const { noteId, ...rest } = await this.prisma.tag.create({
            data: { name: dto.tagName, id: uuidv4(), noteId: dto.noteId },
        })

        return rest
    }

    /**
     * Remove tag from a note
     */
    async removeTagFromNote(
        noteId: string,
        tagId: string,
        userObj: AccessJwtPayload
    ): Promise<void> {
        // Check if note exists and belongs to user
        const note = await this.prisma.note.findFirst({
            where: {
                id: noteId,
                userId: userObj.sub,
            },
        })

        if (!note) {
            throw new NotFoundError(
                `Note with id ${noteId} not found or you don't have access to it`
            )
        }

        // Delete the relation
        await this.prisma.tag.delete({
            where: { id: tagId },
        })
    }
}

export default new TagService()

import express from 'express'
import { authenticateToken } from '../middlewares/auth.middleware'
import tagController from '../controllers/tag.controller'
import { CreateTagReqDto } from '../dtos/tag/create-tag-req.dto'
import { validationMiddleware } from '../middlewares/validation.middleware'
import { validateUUIDParams } from '../middlewares/validateUUIDParam.middleware'

const router = express.Router()

// Get tags by note ID
router.get(
    '/notes/:noteId',
    authenticateToken,
    tagController.getTagsByNoteId.bind(tagController)
)

// Create a new tag and attach it to a note
router.post(
    '/',
    [authenticateToken, validationMiddleware(CreateTagReqDto)],
    tagController.createTag.bind(tagController)
)

// Remove a tag from a note
router.delete(
    '/:tagId/notes/:noteId/',
    [authenticateToken, validateUUIDParams('noteId', 'tagId')],
    tagController.removeTag.bind(tagController)
)

export default router

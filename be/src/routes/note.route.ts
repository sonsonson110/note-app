import express from 'express'
import { validationMiddleware } from '../middlewares/validation.middleware'
import { UpsertNoteReqDto } from '../dtos/note/upsert-note-req.dto'
import { authenticateToken } from '../middlewares/auth.middleware'
import noteController from '../controllers/note.controller'

const router = express.Router()

router.post(
    '/',
    [authenticateToken, validationMiddleware(UpsertNoteReqDto)],
    noteController.upsertNote.bind(noteController)
)
router.get(
    '/', 
    authenticateToken, 
    noteController.getNotes.bind(noteController)
)
router.delete(
    '/:noteId',
    authenticateToken,
    noteController.deleteNote.bind(noteController)
)

export default router

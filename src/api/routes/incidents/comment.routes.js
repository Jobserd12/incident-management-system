import express from 'express';
import { addComment, getComments, deleteComment, updateComment } from '../../../controllers/index.js';
import { requireAuth } from '../../../middleware/auth/auth.middleware.js';
import { validateSchema } from '../../../middleware/validate.middleware.js';
import { addCommentSchema, getCommentsSchema, deleteCommentSchema, updateCommentSchema } from '../../schemas/incidents/index.js';
const router = express.Router();

router.post('/:incidentId/comments', requireAuth, validateSchema(addCommentSchema), addComment);
router.get('/:incidentId/comments', requireAuth, validateSchema(getCommentsSchema), getComments);
router.delete('/:incidentId/comments/:commentId', requireAuth, validateSchema(deleteCommentSchema), deleteComment);
router.patch('/:incidentId/comments/:commentId', requireAuth, validateSchema(updateCommentSchema), updateComment);

export default router; 
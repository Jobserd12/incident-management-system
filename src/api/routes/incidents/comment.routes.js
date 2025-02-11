import express from 'express';
import { addComment, getComments, deleteComment, updateComment } from '../../../controllers/index.js';
import { requireAuth } from '../../../middleware/auth/auth.middleware.js';
import { validateSchema } from '../../../middleware/validate.middleware.js';
import { addCommentSchema, getCommentsSchema, deleteCommentSchema, updateCommentSchema } from '../../schemas/incidents/index.js';
import { checkActionPermission } from '../../../middleware/auth/permission.middleware.js';

const router = express.Router();

router.post('/:incidentId/comments', requireAuth, validateSchema(addCommentSchema), checkActionPermission('commentUpdate'), addComment);
router.get('/:incidentId/comments', requireAuth, validateSchema(getCommentsSchema), checkActionPermission('commentRead'), getComments);
router.delete('/:incidentId/comments/:commentId', requireAuth, validateSchema(deleteCommentSchema), checkActionPermission('commentDelete'), deleteComment);
router.patch('/:incidentId/comments/:commentId', requireAuth, validateSchema(updateCommentSchema), checkActionPermission('commentUpdate'), updateComment);

export default router; 
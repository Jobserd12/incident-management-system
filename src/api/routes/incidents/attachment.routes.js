import express from 'express';
import { uploadAttachments, listAttachments, getAttachment, deleteAttachment, updateAttachment } from '../../../controllers/index.js';
import { requireAuth } from '../../../middleware/auth/auth.middleware.js';
import { validateSchema } from '../../../middleware/validate.middleware.js';
import { validateFiles } from '../../../middleware/validate-files.middleware.js';
import { handleMulterError, upload } from '../../../config/cloudinary.config.js';
import { uploadAttachmentSchema, listAttachmentsSchema, getAttachmentSchema, deleteAttachmentSchema, updateAttachmentSchema } from '../../schemas/incidents/index.js';
import { checkActionPermission } from '../../../middleware/auth/permission.middleware.js';

const router = express.Router();

router.post('/:incidentId/attachments', requireAuth, upload.array('attachments', 5), handleMulterError, validateFiles, validateSchema(uploadAttachmentSchema), checkActionPermission('attachmentUpdate'), uploadAttachments);
router.get('/:incidentId/attachments', requireAuth, validateSchema(listAttachmentsSchema), checkActionPermission('attachmentRead'), listAttachments);
router.get('/:incidentId/attachments/:attachmentId', requireAuth, validateSchema(getAttachmentSchema), checkActionPermission('attachmentRead'), getAttachment);
router.delete('/:incidentId/attachments/:attachmentId', requireAuth, validateSchema(deleteAttachmentSchema), checkActionPermission('attachmentDelete'), deleteAttachment);
router.patch('/:incidentId/attachments/:attachmentId', requireAuth, upload.single('attachment'), handleMulterError, validateFiles, validateSchema(updateAttachmentSchema), checkActionPermission('attachmentUpdate'), updateAttachment);

export default router; 
import express from 'express';
import { linkIncidents, unlinkIncidents, getIncidentRelationships, updateRelationType } from '../../../controllers/index.js';
import { requireAuth } from '../../../middleware/auth/auth.middleware.js';
import { validateSchema } from '../../../middleware/validate.middleware.js';
import { linkIncidentsSchema, unlinkIncidentsSchema, getRelationshipsSchema, updateRelationTypeSchema } from '../../schemas/incidents/index.js';
import { checkActionPermission } from '../../../middleware/auth/permission.middleware.js';

const router = express.Router();

router.post('/:incidentId/relationships', requireAuth, validateSchema(linkIncidentsSchema), checkActionPermission('relationshipManage'), linkIncidents);
router.delete('/:incidentId/relationships/:childId', requireAuth, validateSchema(unlinkIncidentsSchema), checkActionPermission('relationshipManage'), unlinkIncidents);
router.get('/:incidentId/relationships', requireAuth, validateSchema(getRelationshipsSchema), checkActionPermission('relationshipManage'), getIncidentRelationships);
router.patch('/:incidentId/relationships/:childId', requireAuth, validateSchema(updateRelationTypeSchema), checkActionPermission('relationshipManage'), updateRelationType);

export default router; 
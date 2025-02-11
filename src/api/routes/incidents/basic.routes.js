import express from 'express';
import { createIncident, getIncident, getIncidents, updateIncident } from '../../../controllers/index.js';
import { requireAuth } from '../../../middleware/auth/auth.middleware.js';
import { validateSchema } from '../../../middleware/validate.middleware.js';
import { createIncidentSchema, getIncidentSchema, listIncidentsSchema, updateIncidentSchema } from '../../schemas/incidents/index.js';
import { checkActionPermission } from '../../../middleware/auth/permission.middleware.js';

const router = express.Router();

router.post('/', requireAuth, validateSchema(createIncidentSchema), checkActionPermission('createIncident'), createIncident);
router.get('/', requireAuth, validateSchema(listIncidentsSchema), checkActionPermission('readIncident'), getIncidents);
router.patch('/:incidentId', requireAuth, validateSchema(updateIncidentSchema), checkActionPermission('updateIncident'), updateIncident);
router.get('/:incidentId', requireAuth, validateSchema(getIncidentSchema), checkActionPermission('readIncident'), getIncident);

export default router; 
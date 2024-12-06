import express from 'express';
import { createIncident, getIncident, getIncidents, updateIncident } from '../../../controllers/index.js';
import { requireAuth } from '../../../middleware/auth/auth.middleware.js';
import { validateSchema } from '../../../middleware/validate.middleware.js';
import { createIncidentSchema, getIncidentSchema, listIncidentsSchema, updateIncidentSchema } from '../../schemas/incidents/index.js';

const router = express.Router();

router.post('/', requireAuth, validateSchema(createIncidentSchema), createIncident);
router.get('/', requireAuth, validateSchema(listIncidentsSchema), getIncidents);
router.patch('/:incidentId', requireAuth, validateSchema(updateIncidentSchema), updateIncident);
router.get('/:incidentId', requireAuth, validateSchema(getIncidentSchema), getIncident);

export default router; 
import express from 'express';
import { assignIncident, reassignIncident, getTechnicianIncidents, getTechnicianWorkload } from '../../../controllers/index.js';
import { requireAuth } from '../../../middleware/auth/auth.middleware.js';
import { validateSchema } from '../../../middleware/validate.middleware.js';
import { assignIncidentSchema, reassignIncidentSchema, getTechnicianIncidentsSchema, getTechnicianWorkloadSchema } from '../../schemas/incidents/index.js';
const router = express.Router();

router.patch('/:incidentId/assign', requireAuth, validateSchema(assignIncidentSchema), assignIncident);
router.patch('/:incidentId/reassign', requireAuth, validateSchema(reassignIncidentSchema), reassignIncident);
router.get('/technician/:technicianId/incidents', requireAuth, validateSchema(getTechnicianIncidentsSchema), getTechnicianIncidents);
router.get('/technician/:technicianId/workload', requireAuth, validateSchema(getTechnicianWorkloadSchema), getTechnicianWorkload);

export default router; 
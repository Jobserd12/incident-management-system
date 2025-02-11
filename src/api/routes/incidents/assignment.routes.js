import express from 'express';
import { assignIncident, reassignIncident, getTechnicianIncidents, getTechnicianWorkload } from '../../../controllers/index.js';
import { requireAuth } from '../../../middleware/auth/auth.middleware.js';
import { validateSchema } from '../../../middleware/validate.middleware.js';
import { assignIncidentSchema, reassignIncidentSchema, getTechnicianIncidentsSchema, getTechnicianWorkloadSchema } from '../../schemas/incidents/index.js';
import { checkActionPermission } from '../../../middleware/auth/permission.middleware.js';

const router = express.Router();

router.patch('/:incidentId/assign', requireAuth, validateSchema(assignIncidentSchema), checkActionPermission('assignIncident'), assignIncident);
router.patch('/:incidentId/reassign', requireAuth, validateSchema(reassignIncidentSchema), checkActionPermission('assignIncident'), reassignIncident);
router.get('/technician/:technicianId/incidents', requireAuth, validateSchema(getTechnicianIncidentsSchema), checkActionPermission('readIncident'), getTechnicianIncidents);
router.get('/technician/:technicianId/workload', requireAuth, validateSchema(getTechnicianWorkloadSchema), checkActionPermission('readIncident'), getTechnicianWorkload);

export default router; 
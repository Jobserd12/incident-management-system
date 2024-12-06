import express from 'express';
import { startWork, pauseWork, getTimeMetrics } from '../../../controllers/index.js';
import { requireAuth } from '../../../middleware/auth/auth.middleware.js';
import { validateSchema } from '../../../middleware/validate.middleware.js';
import { startWorkSchema, pauseWorkSchema } from '../../schemas/incidents/index.js';
const router = express.Router();

router.patch('/:incidentId/start-work', requireAuth, validateSchema(startWorkSchema), startWork);
router.patch('/:incidentId/pause-work', requireAuth, validateSchema(pauseWorkSchema), pauseWork);
router.get('/metrics/time', requireAuth, getTimeMetrics);

export default router; 
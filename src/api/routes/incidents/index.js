import express from 'express';
import basicRoutes from './basic.routes.js';
import relationshipRoutes from './relationship.routes.js';
import assignmentRoutes from './assignment.routes.js';
import commentRoutes from './comment.routes.js';
import attachmentRoutes from './attachment.routes.js';
import trackingRoutes from './tracking.routes.js';

const router = express.Router();

router.use('/', basicRoutes);
router.use('/', relationshipRoutes);
router.use('/', assignmentRoutes);
router.use('/', commentRoutes);
router.use('/', attachmentRoutes);
router.use('/', trackingRoutes);

export default router; 
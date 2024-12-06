import express from 'express';
import { cleanupDeletedComments } from '../../controllers/index.js';
import { requireAuth } from '../../middleware/auth/auth.middleware.js';

const router = express.Router();

router.post(
  '/cleanup/comments',
  requireAuth, 
  cleanupDeletedComments        
);

export default router; 
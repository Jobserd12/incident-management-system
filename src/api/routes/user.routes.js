import { Router } from 'express';
import { getProfile, updateProfile } from '../../controllers/index.js';
import { requireAuth } from '../../middleware/auth/auth.middleware.js';
import { validateSchema } from '../../middleware/validate.middleware.js';
import { updateProfileSchema } from '../schemas/user/index.js';

const router = Router();

router.patch('/update-profile', requireAuth, validateSchema(updateProfileSchema), updateProfile);
router.get('/profile', requireAuth, getProfile);

export default router;
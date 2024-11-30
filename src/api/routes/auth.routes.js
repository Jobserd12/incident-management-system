import express from 'express';
import { validateSchema } from '../../middleware/validate.middleware.js';
import { registerSchema, loginSchema, emailSchema, validateNewPassword, validateResetToken, changePasswordSchema, verifyNewEmailSchema, changeEmailSchema } from '../schemas/auth/index.js';
import { register, verifyEmail, login, resendVerification, forgotPassword, resetPassword, changePassword, verifyNewEmail, changeEmail } from '../../controllers/auth.controller.js';
import { authenticate, requireAuth } from '../../middleware/auth/auth.middleware.js';

const router = express.Router();

router.post('/register', validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), authenticate('local'), login);

router.get('/verify-email', verifyEmail);
router.post('/resend-verification', validateSchema(emailSchema), resendVerification);

router.post('/forgot-password', validateSchema(emailSchema), forgotPassword);
router.post('/reset-password', validateSchema(validateResetToken, 'query'), validateSchema(validateNewPassword), resetPassword);
router.post('/change-password', requireAuth, validateSchema(changePasswordSchema), changePassword);
router.post('/change-email', requireAuth, validateSchema(changeEmailSchema), changeEmail);
router.get('/verify-new-email', validateSchema(verifyNewEmailSchema, 'query'), verifyNewEmail);

export default router;
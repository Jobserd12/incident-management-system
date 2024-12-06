import express from 'express';
import { validateSchema } from '../../middleware/validate.middleware.js';
import { registerSchema, loginSchema, emailSchema, changePasswordSchema, verifyNewEmailSchema, changeEmailSchema, resetPasswordSchema } from '../schemas/auth/index.js';
import { register, verifyEmail, login, resendVerification, forgotPassword, resetPassword, changePassword, verifyNewEmail, changeEmail, googleCallback } from '../../controllers/auth.controller.js';
import { authenticate, requireAuth } from '../../middleware/auth/auth.middleware.js';
import passport from 'passport';

const router = express.Router();

router.post('/register', validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), authenticate('local'), login);

router.get('/verify-email', verifyEmail);
router.post('/resend-verification', validateSchema(emailSchema), resendVerification);

router.post('/forgot-password', validateSchema(emailSchema), forgotPassword);
router.post('/reset-password', validateSchema(resetPasswordSchema), resetPassword);
router.post('/change-password', requireAuth, validateSchema(changePasswordSchema), changePassword);
router.post('/change-email', requireAuth, validateSchema(changeEmailSchema), changeEmail);
router.get('/verify-new-email', validateSchema(verifyNewEmailSchema), verifyNewEmail);

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: true, session: false }), googleCallback );

export default router;
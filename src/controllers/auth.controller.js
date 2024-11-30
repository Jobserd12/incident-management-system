import authService from '../services/auth.service.js';
import config from '../config/config.js';
import { AUTH_MESSAGES } from '../api/constants/messages.js';
import { generateGoogleAuthToken } from '../utils/auth.utils.js';

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  register = async (req, res, next) => {
    try {
      const result = await this.authService.register(req.body);
      
      res.status(201).json({
        status: 'success',
        message: result.isTestEmail 
          ? AUTH_MESSAGES.REGISTER.TEST_SUCCESS
          : AUTH_MESSAGES.REGISTER.SUCCESS,
        data: {
          user: result.user,
          verificationLink: result.isTestEmail 
            ? `${config.baseUrl}/auth/verify-email?token=${result.verificationToken}`
            : undefined,
          note: result.isTestEmail
            ? AUTH_MESSAGES.EMAIL.VERIFICATION.TEST_NOTE
            : AUTH_MESSAGES.EMAIL.VERIFICATION.SENT_NOTE
        }
      });
    } catch (error) {
      next(error);
    }
  }

  verifyEmail = async (req, res, next) => {
    try {
      const result = await this.authService.verifyEmail(req.query.token);

      res.json({
        status: 'success',
        message: AUTH_MESSAGES.EMAIL.VERIFICATION.SUCCESS,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  login = async (req, res, next) => {
    try {
      const result = await this.authService.login(req.body);
      
      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  resendVerification = async (req, res, next) => {
    try {
      const result = await this.authService.resendVerification(req.body.email);
      
      res.json({
        status: 'success',
        message: result.note,
        data: {
          intentosRestantes: result.intentosRestantes,
          nextResendAvailable: result.nextResendAvailable,
          verificationLink: result.verificationLink
        }
      });
    } catch (error) {
      next(error);
    }
  }

  forgotPassword = async (req, res, next) => {
    try {
      const result = await this.authService.forgotPassword(req.body.email);
      
      res.json({
        status: 'success',
        message: result.message,
        data: {
          token: result.token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  resetPassword = async (req, res, next) => {
    try {
      const { token } = req.query;
      const { newPassword } = req.body;

      const result = await this.authService.resetPassword(token, newPassword);

      res.json({
        status: 'success',
        message: result.message
      });
      
    } catch (error) {
      next(error);
    }
  }

  changePassword = async (req, res, next) => {
    try {
      const userId = req.user.id; 
      const { currentPassword, newPassword } = req.body;

      const result = await this.authService.changePassword(
        userId, 
        currentPassword, 
        newPassword
      );

      res.json({
        status: 'success',
        message: AUTH_MESSAGES.PASSWORD.CHANGE.SUCCESS
      });
      
    } catch (error) {
      next(error);
    }
  }

  changeEmail = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newEmail } = req.body;

      const result = await this.authService.initiateEmailChange(
        userId, 
        currentPassword, 
        newEmail
      );

      res.json({
        status: 'success',
        message: AUTH_MESSAGES.EMAIL.CHANGE.VERIFICATION_SENT,
        data: {
          verificationLink: result.isTestEmail ? result.verificationLink : undefined
        }
      });
    } catch (error) {
      next(error);
    }
  }

  verifyNewEmail = async (req, res, next) => {
    try {
      const { token } = req.query;
      
      const result = await this.authService.verifyNewEmail(token);

      res.json({
        status: 'success',
        message: AUTH_MESSAGES.EMAIL.CHANGE.SUCCESS,
        data: {
          email: result.newEmail
        }
      });
    } catch (error) {
      next(error);
    }
  }

  googleCallback = async (req, res, next) => {
    try {
      const token = generateGoogleAuthToken(req.user);
      
      return res.status(200).json({
        status: 'success',
        message: AUTH_MESSAGES.GOOGLE.SUCCESS,
        data: {
          token,
          user: {
            id: req.user._id,
            email: req.user.email,
            username: req.user.username,
            name: req.user.name,
            role: req.user.role,
            google: req.user.google
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

}

const authController = new AuthController(authService);

export const register = authController.register.bind(authController);
export const verifyEmail = authController.verifyEmail.bind(authController);
export const login = authController.login.bind(authController);
export const resendVerification = authController.resendVerification.bind(authController); 
export const forgotPassword = authController.forgotPassword.bind(authController); 
export const resetPassword = authController.resetPassword.bind(authController); 
export const changePassword = authController.changePassword.bind(authController); 
export const changeEmail = authController.changeEmail.bind(authController);
export const verifyNewEmail = authController.verifyNewEmail.bind(authController); 
export const googleCallback = authController.googleCallback.bind(authController);
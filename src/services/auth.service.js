import Boom from '@hapi/boom';
import userRepository from '../repositories/user.repository.js';
import { generateAuthToken, generateResetPasswordToken, generateVerificationToken } from '../utils/auth.utils.js';
import { sendPasswordResetEmail, sendVerificationEmail } from '../utils/email.utils.js';
import config from '../config/config.js';
import { AUTH_MESSAGES, ERROR_MESSAGES } from '../api/constants/messages.js';

export class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register({ email, password, username, department }) {
    const existingEmail = await this.userRepository.findByEmail(email);
    const existingUsername = await this.userRepository.findByUsername(username);
    
    const errors = [];
    if (existingEmail) errors.push(AUTH_MESSAGES.REGISTER.EMAIL_EXISTS);
    if (existingUsername) errors.push(AUTH_MESSAGES.REGISTER.USERNAME_TAKEN);
    
    if (errors.length > 0) {
      throw Boom.conflict(errors.join(' y '));
    }

    const verificationToken = generateVerificationToken(email);
    
    const user = await this.userRepository.create({
      email,
      password,
      username,
      department,
      isVerified: false,
      emailVerification: {
        token: verificationToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });

    const isTestEmail = email.endsWith('@test.com') || email.endsWith('@example.com');

    if (!isTestEmail) {
      try {
        await sendVerificationEmail(user, verificationToken);
      } catch (error) {
        throw Boom.internal(ERROR_MESSAGES.SERVER.EMAIL_SEND);
      }
    }

    return {
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      },
      verificationToken,
      isTestEmail
    };
  }

  async verifyEmail(token) {
    const user = await this.userRepository.findByVerificationToken(token);

    if (!user) {
      throw Boom.badRequest(AUTH_MESSAGES.EMAIL.VERIFICATION.INVALID_TOKEN);
    }

    user.isVerified = true;
    user.emailVerification = undefined;
    await user.save();

    const accessToken = generateVerificationToken(user);

    return {
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    };
  }

  async login({ email, password }) {
    const user = await this.userRepository.findByEmailWithPassword(email);
    if (!user) {
      throw Boom.unauthorized(AUTH_MESSAGES.LOGIN.INVALID_CREDENTIALS);
    }
    const token = generateAuthToken(user);

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    };
  }

  async resendVerification(email) {
    const userExists = await this.userRepository.findByEmail(email);
    if (!userExists) {
      throw Boom.notFound(AUTH_MESSAGES.USER.NOT_FOUND);
    }

    if (userExists.isVerified) {
      throw Boom.badRequest(AUTH_MESSAGES.EMAIL.VERIFICATION.ALREADY_VERIFIED);
    }

    const withinLimit = await this.userRepository.checkResendLimit(email);
    if (!withinLimit) {
      throw Boom.tooManyRequests(AUTH_MESSAGES.EMAIL.RESEND.LIMIT_REACHED);
    }

    const canResendNow = await this.userRepository.checkResendCooldown(email);
    if (!canResendNow) {
      throw Boom.tooManyRequests(AUTH_MESSAGES.EMAIL.RESEND.COOLDOWN);
    }

    const verificationToken = generateVerificationToken(email);
    await this.userRepository.updateVerificationToken(userExists, verificationToken);

    const isTestEmail = email.endsWith('@test.com') || email.endsWith('@example.com');

    if (!isTestEmail) {
      try {
        await sendVerificationEmail(userExists, verificationToken);
      } catch (error) {
        throw Boom.internal(ERROR_MESSAGES.SERVER.EMAIL_SEND);
      }
    }

    return {
      message: AUTH_MESSAGES.EMAIL.RESEND.SUCCESS,
      intentosRestantes: 3 - (userExists.emailVerification?.resendCount || 0),
      nextResendAvailable: new Date(Date.now() + 15 * 60 * 1000),
      verificationLink: isTestEmail 
        ? `${config.baseUrl}/auth/verify-email?token=${verificationToken}`
        : undefined,
      note: isTestEmail 
        ? AUTH_MESSAGES.EMAIL.VERIFICATION.TEST_NOTE
        : AUTH_MESSAGES.EMAIL.VERIFICATION.SENT_NOTE
    };
  }

  async forgotPassword(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw Boom.notFound(AUTH_MESSAGES.USER.NOT_FOUND);
    }

    const withinLimit = await this.userRepository.checkPasswordResetLimit(email);
    if (!withinLimit) {
      throw Boom.tooManyRequests(AUTH_MESSAGES.EMAIL.RESEND.LIMIT_REACHED);
    }

    const canResendNow = await this.userRepository.checkPasswordResetCooldown(email);
    if (!canResendNow) {
      throw Boom.tooManyRequests(AUTH_MESSAGES.EMAIL.RESEND.COOLDOWN);
    }

    const resetToken = generateResetPasswordToken(email);
    await this.userRepository.updatePasswordResetToken(user, resetToken);

    const isTestEmail = email.endsWith('@test.com') || email.endsWith('@example.com');

    if (!isTestEmail) {
      try {
        await sendPasswordResetEmail(user, resetToken);
      } catch (error) {
        throw Boom.internal(ERROR_MESSAGES.SERVER.EMAIL_SEND);
      }
    }

    return {
      message: AUTH_MESSAGES.PASSWORD.RESET.LINK_SENT,
      token: resetToken,
      intentosRestantes: 3 - (user.passwordReset?.resendCount || 0),
      nextResendAvailable: new Date(Date.now() + 15 * 60 * 1000)
    };
  }

  async resetPassword(token, newPassword) {
    const user = await this.userRepository.findByPasswordResetToken(token);
    if (!user) {
      throw Boom.badRequest(AUTH_MESSAGES.PASSWORD.RESET.INVALID_TOKEN);
    }

    const userWithPassword = await this.userRepository.findByEmailWithPassword(user.email);
    
    const isSamePassword = await userWithPassword.comparePassword(newPassword);
    if (isSamePassword) {
      throw Boom.badRequest(AUTH_MESSAGES.PASSWORD.RESET.SAME_PASSWORD);
    }
    
    user.password = newPassword;
    user.passwordReset = undefined;
    await user.save();

    return {
      message: AUTH_MESSAGES.PASSWORD.RESET.SUCCESS
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await this.userRepository.findByIdWithPassword(userId);
    if (!user) {
      throw Boom.notFound(AUTH_MESSAGES.USER.NOT_FOUND);
    }

    if (!user.canChangePassword()) {
      throw Boom.tooManyRequests(AUTH_MESSAGES.PASSWORD.CHANGE.LIMIT_REACHED);
    }

    const canChangeNow = await this.userRepository.checkPasswordChangeCooldown(userId);
    if (!canChangeNow) {
      throw Boom.tooManyRequests(AUTH_MESSAGES.PASSWORD.CHANGE.COOLDOWN);
    }

    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      throw Boom.unauthorized(AUTH_MESSAGES.PASSWORD.CHANGE.INVALID_CURRENT);
    }

    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      throw Boom.badRequest(AUTH_MESSAGES.PASSWORD.CHANGE.SAME_PASSWORD);
    }

    await this.userRepository.updatePasswordChange(user, newPassword);

    return {
      message: AUTH_MESSAGES.PASSWORD.CHANGE.SUCCESS
    };
  }

  async initiateEmailChange(userId, currentPassword, newEmail) {
    const user = await this.userRepository.findByIdWithPassword(userId);
    if (!user) {
      throw Boom.notFound(AUTH_MESSAGES.USER.NOT_FOUND);
    }

    if (!user.canChangeEmail()) {
      throw Boom.tooManyRequests(AUTH_MESSAGES.EMAIL.CHANGE.LIMIT_REACHED);
    }

    const canChangeNow = await this.userRepository.checkEmailChangeCooldown(userId);
    if (!canChangeNow) {
      throw Boom.tooManyRequests(AUTH_MESSAGES.EMAIL.CHANGE.COOLDOWN);
    }

    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      throw Boom.unauthorized(AUTH_MESSAGES.PASSWORD.CHANGE.INVALID_CURRENT);
    }

    if (user.email === newEmail) {
      throw Boom.badRequest(AUTH_MESSAGES.EMAIL.CHANGE.SAME_EMAIL);
    }

    const existingEmail = await this.userRepository.findByEmail(newEmail);
    if (existingEmail) {
      throw Boom.conflict(AUTH_MESSAGES.EMAIL.CHANGE.EMAIL_EXISTS);
    }

    const verificationToken = generateVerificationToken(newEmail);
    await this.userRepository.updateEmailChangeToken(user, newEmail, verificationToken);

    const isTestEmail = newEmail.endsWith('@test.com') || newEmail.endsWith('@example.com');
    if (!isTestEmail) {
      try {
        await sendEmailChangeVerification(user, newEmail, verificationToken);
      } catch (error) {
        throw Boom.internal(ERROR_MESSAGES.SERVER.EMAIL_SEND);
      }
    }

    return {
      message: AUTH_MESSAGES.EMAIL.CHANGE.VERIFICATION_SENT,
      isTestEmail,
      verificationLink: isTestEmail ? 
        `${config.baseUrl}/auth/verify-new-email?token=${verificationToken}` : 
        undefined
    };
  }

  async verifyNewEmail(token) {
    const user = await this.userRepository.findByEmailChangeToken(token);
    if (!user) {
      throw Boom.badRequest(AUTH_MESSAGES.EMAIL.CHANGE.INVALID_TOKEN);
    }

    const newEmail = user.emailChange.newEmail;
    
    const existingEmail = await this.userRepository.findByEmail(newEmail);
    if (existingEmail) {
      throw Boom.conflict(AUTH_MESSAGES.EMAIL.CHANGE.EMAIL_EXISTS);
    }

    user.email = newEmail;
    user.emailChange = undefined;
    await user.save();

    return {
      message: AUTH_MESSAGES.EMAIL.CHANGE.SUCCESS,
      newEmail
    };
  }
}

export default new AuthService(userRepository); 
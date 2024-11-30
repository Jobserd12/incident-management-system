import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';


export const generateAuthToken = (user) => {
  return jwt.sign(
    { 
      sub: user._id,
      email: user.email,
      username: user.username,
      role: user.role 
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiration }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

export const generateVerificationToken = (email) => {
  return jwt.sign(
    { 
      email,
      type: 'email_verification'
    },
    config.jwt.secret,
    { expiresIn: '24h' }
  );
};

export const generateResetPasswordToken = (email) => {
  return jwt.sign(
    { 
      email,
      type: 'password_reset'
    },
    config.jwt.secret,
    { expiresIn: '1h' }
  );
}; 
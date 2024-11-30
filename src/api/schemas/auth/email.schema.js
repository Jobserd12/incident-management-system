import Joi from 'joi';
import { commonValidations } from './validations.js';

export const emailSchema = Joi.object({
  email: commonValidations.email
});

export const changeEmailSchema = Joi.object({
  currentPassword: commonValidations.password,
  newEmail: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El nuevo correo debe ser válido',
      'string.empty': 'El nuevo correo es requerido',
      'any.required': 'El nuevo correo es requerido'
    })
});

export const verifyNewEmailSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'string.empty': 'El token es requerido',
      'any.required': 'El token es requerido'
    })
});


  
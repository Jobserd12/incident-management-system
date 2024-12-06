import Joi from 'joi';
import { commonValidations } from './validations.js';

export const emailSchema = Joi.object({
  body: Joi.object({
    email: commonValidations.email
  }).required()
});

export const changeEmailSchema = Joi.object({
  body: Joi.object({
    currentPassword: commonValidations.password,
    newEmail: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'El nuevo correo debe ser válido',
        'string.empty': 'El nuevo correo es requerido',
        'any.required': 'El nuevo correo es requerido'
      })
  }).required()
});


export const verifyNewEmailSchema = Joi.object({
  query: Joi.object({
    token: Joi.string()
      .required()
      .messages({
        'string.empty': 'El token es requerido',
        'any.required': 'El token es requerido'
      })
  }).required()
});
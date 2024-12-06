import Joi from 'joi';
import { commonValidations } from './validations.js';
import { PASSWORD_REGEX } from '../../constants/regex.js';

export const passwordValidations = {
  newPassword: Joi.string()
    .pattern(PASSWORD_REGEX)
    .required()
    .messages({
      'string.pattern.base': 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un caracter especial',
      'string.empty': 'La nueva contraseña es requerida',
      'any.required': 'La nueva contraseña es requerida'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Las contraseñas no coinciden',
      'string.empty': 'La confirmación de contraseña es requerida',
      'any.required': 'La confirmación de contraseña es requerida'
    })
};

export const resetPasswordSchema = Joi.object({
  query: Joi.object({
    token: Joi.string()
      .required()
      .messages({
        'string.empty': 'El token es requerido',
        'any.required': 'El token es requerido'
      })
  }).required(),

  body: Joi.object({
    newPassword: passwordValidations.newPassword,
    confirmPassword: passwordValidations.confirmPassword
  }).required()
});

export const changePasswordSchema = Joi.object({
  body: Joi.object({
    currentPassword: commonValidations.password,
    newPassword: passwordValidations.newPassword
      .disallow(Joi.ref('currentPassword'))
      .messages({
        'any.invalid': 'La nueva contraseña no puede ser igual a la actual',
        ...passwordValidations.newPassword.messages
      }),
    confirmPassword: passwordValidations.confirmPassword
  }).required()
});
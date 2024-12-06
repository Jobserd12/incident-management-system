import Joi from 'joi';
import { commonValidations } from './validations.js';
import { USERNAME_REGEX } from '../../constants/regex.js';

export const registerSchema = Joi.object({
  body: Joi.object({
    username: Joi.string()
      .pattern(USERNAME_REGEX)
      .required()
      .messages({
        'string.pattern.base': 'El username debe tener entre 3 y 50 caracteres y solo puede contener letras, números, guiones y guiones bajos',
        'any.required': 'El username es requerido',
        'string.empty': 'El username es requerido'
      }),
    email: commonValidations.email,
    password: commonValidations.password,
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required() 
      .messages({
        'any.only': 'Las contraseñas no coinciden',
        'any.required': 'La confirmación de contraseña es requerida',
        'string.empty': 'La confirmación de contraseña es requerida'
      })
  }).required()
});
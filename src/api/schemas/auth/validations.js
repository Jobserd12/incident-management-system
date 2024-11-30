import Joi from 'joi';
import { PASSWORD_REGEX } from '../../constants/regex.js';

export const commonValidations = {
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El formato del email no es válido',
      'any.required': 'El email es requerido',
      'string.empty': 'El email es requerido'
    }),
    
  password: Joi.string()
    .pattern(PASSWORD_REGEX)
    .required()
    .messages({
      'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un caracter especial',
      'any.required': 'La contraseña es requerida',
      'string.empty': 'La contraseña es requerida'
    })
}; 
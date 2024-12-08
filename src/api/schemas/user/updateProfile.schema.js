import Joi from 'joi';
import { USERNAME_REGEX } from '../../constants/regex.js';

export const updateProfileSchema = Joi.object({
    body: Joi.object({
        username: Joi.string()
          .pattern(USERNAME_REGEX)
          .messages({
            'string.pattern.base': 'El username debe tener entre 3 y 50 caracteres y solo puede contener letras, números, guiones y guiones bajos'
          }),
        department: Joi.string()
          .valid('it', 'desarrollo', 'infraestructura', 'soporte tecnico', 'seguridad', 'administracion')
          .messages({
            'any.only': 'El departamento no es válido'
          })
    }).min(1).messages({
      'object.min': 'Debes proporcionar al menos un campo para actualizar (username o department)'
    })
});

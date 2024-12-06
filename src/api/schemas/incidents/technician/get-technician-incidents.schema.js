import Joi from 'joi';
import { objectId } from '../../validators/custom.validators.js';

export const getTechnicianIncidentsSchema = Joi.object({
  params: Joi.object({
    technicianId: Joi.string()
      .required()
      .custom(objectId)
      .messages({
        'any.required': 'El ID del técnico es requerido',
        'any.invalid': 'El formato del ID del técnico no es válido',
        'string.empty': 'El ID del técnico es requerido'
      })
  }).required(),

  query: Joi.object({
    status: Joi.string()
      .valid('nuevo', 'en_progreso', 'resuelto', 'cerrado', 'rechazado')
      .optional()
      .messages({
        'any.only': 'Estado no válido'
      }),
    priority: Joi.string()
      .valid('baja', 'media', 'alta', 'crítica')
      .optional()
      .messages({
        'any.only': 'Prioridad no válida'
      })
  }).optional()
}); 
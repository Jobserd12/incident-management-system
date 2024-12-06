import Joi from 'joi';
import { objectId } from '../../validators/custom.validators.js';

export const getCommentsSchema = Joi.object({
  params: Joi.object({
    incidentId: Joi.string()
      .required()
      .custom(objectId)
      .messages({
        'any.required': 'El ID del incidente es requerido',
        'string.empty': 'El ID del incidente es requerido',
        'any.invalid': 'El formato del ID del incidente no es válido'
      })
  }).required(),

  query: Joi.object({
    limit: Joi.number()
      .min(1)
      .max(100)
      .optional()
      .messages({
        'number.min': 'El límite debe ser mayor a 0',
        'number.max': 'El límite no puede ser mayor a 100'
      }),
    page: Joi.number()
      .min(1)
      .optional()
      .messages({
        'number.min': 'La página debe ser mayor a 0'
      })
  }).optional()
}); 
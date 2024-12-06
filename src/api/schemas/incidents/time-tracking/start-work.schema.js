import Joi from 'joi';
import { objectId } from '../../validators/custom.validators.js';

export const startWorkSchema = Joi.object({
  params: Joi.object({
    incidentId: Joi.string()
      .required()
      .custom(objectId)
      .messages({
        'any.required': 'El ID del incidente es requerido',
        'any.invalid': 'El formato del ID del incidente no es válido'
      })
  }).required(),

  body: Joi.object({
    estimated: Joi.number()
      .min(0)
      .optional()
      .messages({
        'number.min': 'El tiempo estimado no puede ser negativo',
        'number.base': 'El tiempo estimado debe ser un número'
      })
  }).optional()
}); 
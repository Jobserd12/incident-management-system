import Joi from 'joi';
import { objectId } from '../../validators/custom.validators.js';

export const addCommentSchema = Joi.object({
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

  body: Joi.object({
    text: Joi.string()
      .required()
      .trim()
      .min(2)
      .max(500)
      .messages({
        'string.empty': 'El comentario es requerido',
        'string.min': 'El comentario debe tener al menos 2 caracteres',
        'string.max': 'El comentario no puede exceder los 500 caracteres',
        'any.required': 'El comentario es requerido'
      })
  }).required()
}); 
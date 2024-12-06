import Joi from 'joi';
import { objectId } from '../../validators/custom.validators.js';

export const deleteCommentSchema = Joi.object({
  params: Joi.object({
    incidentId: Joi.string()
      .required()
      .custom(objectId)
      .messages({
        'any.required': 'El ID del incidente es requerido',
        'any.invalid': 'El formato del ID del incidente no es válido'
      }),
    commentId: Joi.string()
      .required()
      .custom(objectId)
      .messages({
        'any.required': 'El ID del comentario es requerido',
        'any.invalid': 'El formato del ID del comentario no es válido'
      })
  }).required()
}); 
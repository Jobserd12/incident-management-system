import Joi from 'joi';
import { objectId } from '../../validators/custom.validators.js';

export const pauseWorkSchema = Joi.object({
  params: Joi.object({
    incidentId: Joi.string()
      .required()
      .custom(objectId)
      .messages({
        'any.required': 'El ID del incidente es requerido',
        'any.invalid': 'El formato del ID del incidente no es válido'
      })
  }).required()
}); 
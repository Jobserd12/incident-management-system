import Joi from 'joi';
import { objectId } from '../../validators/custom.validators.js';

export const getTechnicianWorkloadSchema = Joi.object({
  params: Joi.object({
    technicianId: Joi.string()
      .required()
      .custom(objectId)
      .messages({
        'any.required': 'El ID del técnico es requerido',
        'any.invalid': 'El formato del ID del técnico no es válido',
        'string.empty': 'El ID del técnico es requerido'
      })
  }).required()
}); 
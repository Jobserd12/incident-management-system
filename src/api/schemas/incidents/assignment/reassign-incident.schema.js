import Joi from 'joi';
import { objectId } from '../../validators/custom.validators.js';

export const reassignIncidentSchema = Joi.object({
  params: Joi.object({
    incidentId: Joi.string()
      .required()
      .custom(objectId)
      .messages({
        'any.required': 'El ID del incidente es requerido',
        'any.invalid': 'El ID del incidente no es válido',
        'string.empty': 'El ID del incidente es requerido'
      })
  }).required(),

  body: Joi.object({
    technicianId: Joi.string()
      .required()
      .custom(objectId)
      .messages({
        'any.required': 'El ID del nuevo técnico es requerido',
        'any.invalid': 'El ID del técnico no es válido',
        'string.empty': 'El ID del técnico es requerido'
      }),

    reason: Joi.string()
      .min(10)
      .max(200)
      .required()
      .messages({
        'string.empty': 'La razón de reasignación es requerida',
        'string.min': 'La razón debe tener al menos 10 caracteres',
        'string.max': 'La razón no puede exceder los 200 caracteres',
        'any.required': 'Debe proporcionar una razón para la reasignación'
      })
  }).required()
});

export default reassignIncidentSchema; 
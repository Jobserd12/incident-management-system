import Joi from 'joi';
import { objectId } from '../../validators/custom.validators.js';

export const linkIncidentsSchema = Joi.object({
  params: Joi.object({
    incidentId: Joi.string()
      .required()
      .custom(objectId)
      .messages({
        'any.required': 'El ID de la incidencia padre es requerido',
        'string.empty': 'El ID de la incidencia padre no puede estar vacío',
        'any.invalid': 'El formato del ID de la incidencia padre no es válido'
      })
  }).required(),

  body: Joi.object({
    childId: Joi.string()
      .required()
      .custom(objectId)
      .messages({
        'any.required': 'El ID de la incidencia hijo es requerido',
        'string.empty': 'El ID de la incidencia hijo es requerido',
        'any.invalid': 'El formato del ID de la incidencia hijo no es válido'
      }),
    type: Joi.string()
      .valid('dependencia', 'relación')
      .default('relación')
      .messages({
        'any.only': 'El tipo de relación debe ser: dependencia o relación'
      })
  }).required()
}); 
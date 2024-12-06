import Joi from 'joi';
import { objectId } from '../../validators/custom.validators.js';

export const updateRelationTypeSchema = Joi.object({
  params: Joi.object({
    incidentId: Joi.string()
      .required()
      .custom(objectId)
      .messages({
        'any.required': 'El ID de la incidencia padre es requerido',
        'string.empty': 'El ID de la incidencia padre no puede estar vacío',
        'any.invalid': 'El formato del ID de la incidencia padre no es válido'
      }),
    childId: Joi.string()
      .required()
      .custom(objectId)
      .messages({
        'any.required': 'El ID de la incidencia hijo es requerido',
        'string.empty': 'El ID de la incidencia hijo no puede estar vacío',
        'any.invalid': 'El formato del ID de la incidencia hijo no es válido'
      })
  }).required(),
  body: Joi.object({
    type: Joi.string()
      .required()
      .valid('dependencia', 'relación')
      .messages({
        'any.required': 'El tipo de relación es requerido',
        'string.empty': 'El tipo de relación no puede estar vacío',
        'any.only': 'El tipo de relación debe ser "dependencia" o "relación"'
      })
  }).required()
}); 
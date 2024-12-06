import Joi from 'joi';
import { objectId } from '../../validators/custom.validators.js';

export const getRelationshipsSchema = Joi.object({
  params: Joi.object({
    incidentId: Joi.string()
      .required()
      .custom(objectId)
      .messages({
        'any.required': 'El ID de la incidencia es requerido',
        'string.empty': 'El ID de la incidencia no puede estar vacío',
        'any.invalid': 'El formato del ID de la incidencia no es válido'
      })
  }).required()
}); 
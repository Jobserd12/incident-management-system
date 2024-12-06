import Joi from 'joi';
import { objectId } from '../../validators/custom.validators.js';

export const updateAttachmentSchema = Joi.object({
  params: Joi.object({
    incidentId: Joi.string()
      .required()
      .custom(objectId)
      .messages({
        'any.required': 'El ID del incidente es requerido',
        'string.empty': 'El ID del incidente no puede estar vacío',
        'any.invalid': 'El formato del ID del incidente no es válido'
      }),
    attachmentId: Joi.string()
      .required()
      .custom(objectId)
      .messages({
        'any.required': 'El ID del archivo adjunto es requerido',
        'string.empty': 'El ID del archivo adjunto no puede estar vacío',
        'any.invalid': 'El formato del ID del archivo adjunto no es válido'
      })
  }).required(),
  body: Joi.object({
    description: Joi.string()
      .max(200)
      .allow('', null)
      .optional()
      .messages({
        'string.max': 'La descripción no puede exceder los 200 caracteres'
      })
  }).unknown(true)
}); 
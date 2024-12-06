import Joi from 'joi';
import { objectId } from '../../validators/custom.validators.js';

export const updateStatusSchema = Joi.object({
  params: Joi.object({
    incidentId: Joi.string()
      .required()
      .custom(objectId)
      .messages({
        'any.required': 'El ID del incidente es requerido',
        'string.empty': 'El ID del incidente es requerido',
        'any.invalid': 'El formato del ID del incidente no es válido',
        'string.base': 'El ID del incidente debe ser una cadena de texto'
      })
  }).required(),

  body: Joi.object({
    status: Joi.string()
      .valid('nuevo', 'en_progreso', 'resuelto', 'cerrado', 'rechazado')
      .required()
      .messages({
        'any.only': 'Estado no válido. Los estados permitidos son: nuevo, en_progreso, resuelto, cerrado, rechazado',
        'any.required': 'El estado es requerido',
        'string.empty': 'El estado es requerido'
      }),

    resolution: Joi.when('status', {
      is: Joi.string().valid('resuelto', 'rechazado', 'cerrado'),
      then: Joi.string()
        .required()
        .min(10)
        .max(1000)
        .messages({
          'any.required': 'La resolución es requerida para los estados: resuelto, rechazado o cerrado',
          'string.empty': 'La resolución es requerida',
          'string.min': 'La resolución debe tener al menos 10 caracteres',
          'string.max': 'La resolución no puede exceder los 1000 caracteres'
        }),
      otherwise: Joi.forbidden()
        .messages({
          'any.unknown': 'La resolución solo se permite para los estados: resuelto, rechazado o cerrado'
        })
    })
  }).required()
});
import Joi from 'joi';
import { objectId } from '../../validators/custom.validators.js';

export const updateIncidentSchema = Joi.object({
  params: Joi.object({
    incidentId: Joi.string()
      .required()
      .custom(objectId)
      .messages({
        'any.required': 'El ID del incidente es requerido',
        'string.empty': 'El ID del incidente no puede estar vacío',
        'any.invalid': 'El formato del ID del incidente no es válido'
      })
  }).required(),

  body: Joi.object({
    title: Joi.string()
      .min(5)
      .max(100)
      .optional()
      .messages({
        'string.min': 'El título debe tener al menos 5 caracteres',
        'string.max': 'El título no puede exceder los 100 caracteres'
      }),

    description: Joi.string()
      .min(10)
      .max(1000)
      .optional()
      .messages({
        'string.min': 'La descripción debe tener al menos 10 caracteres',
        'string.max': 'La descripción no puede exceder los 1000 caracteres'
      }),

    priority: Joi.string()
      .valid('baja', 'media', 'alta', 'crítica')
      .optional()
      .messages({
        'any.only': 'La prioridad debe ser: baja, media, alta o crítica'
      }),

    category: Joi.string()
      .valid('hardware', 'software', 'red', 'seguridad', 'accesos', 'otros')
      .optional()
      .messages({
        'any.only': 'La categoría debe ser: hardware, software, red, seguridad, accesos u otros'
      }),

    tags: Joi.array()
      .items(Joi.string().trim())
      .optional()
      .messages({
        'array.base': 'Las etiquetas deben ser un array de strings'
      }),

    dueDate: Joi.date()
      .greater('now')
      .optional()
      .messages({
        'date.greater': 'La fecha de vencimiento debe ser posterior a la fecha actual'
      }),

    timeTracking: Joi.object({
      estimated: Joi.number()
        .min(0)
        .optional()
        .messages({
          'number.min': 'El tiempo estimado no puede ser negativo'
        }),
      spent: Joi.string()
        .optional()
    }).optional()

  }).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar'
  })
}); 
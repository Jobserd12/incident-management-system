import Joi from 'joi';

export const createIncidentSchema = Joi.object({
  body: Joi.object({
  title: Joi.string()
    .required()
    .trim()
    .min(5)
    .max(100)
    .messages({
      'string.empty': 'El título es requerido',
      'string.min': 'El título debe tener al menos 5 caracteres',
      'string.max': 'El título no puede exceder los 100 caracteres'
    }),

  description: Joi.string()
    .required()
    .trim()
    .min(10)
    .max(1000)
    .messages({
      'string.empty': 'La descripción es requerida',
      'string.min': 'La descripción debe tener al menos 10 caracteres',
      'string.max': 'La descripción no puede exceder los 1000 caracteres'
    }),

  priority: Joi.string()
    .valid('baja', 'media', 'alta', 'crítica')
    .required()
    .messages({
      'any.only': 'La prioridad debe ser: baja, media, alta o crítica', 
      'any.required': 'La prioridad es requerida',
      'string.empty': 'La prioridad es requerida'
    }),

  category: Joi.string()
    .valid('hardware', 'software', 'red', 'seguridad', 'accesos', 'otros')
    .required()
    .messages({
      'any.only': 'La categoría debe ser: hardware, software, red, seguridad, accesos u otros',
      'any.required': 'La categoría es requerida'
    }),

  dueDate: Joi.date()
    .greater('now')
    .required()
    .messages({
      'any.required': 'La fecha de vencimiento es requerida',
      'date.empty': 'La fecha de vencimiento es requerida',
      'date.greater': 'La fecha de vencimiento debe ser posterior a la fecha actual',
      'date.base': 'La fecha de vencimiento debe ser una fecha válida'
    }),

  timeTracking: Joi.object({
    estimated: Joi.number()
      .min(0)
      .optional()
      .messages({
        'number.min': 'El tiempo estimado no puede ser negativo'
      })
  }).optional(),

  tags: Joi.array()
    .items(Joi.string().trim())
    .optional()
    .messages({
      'array.base': 'Las etiquetas deben ser un array de strings'
    })
  }).required().messages({
    'object.unknown': 'No se permiten campos adicionales en el body'
  })
});
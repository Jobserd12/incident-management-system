import Joi from 'joi';

export const listIncidentsSchema = Joi.object({
  query: Joi.object({
    status: Joi.string()
      .valid('nuevo', 'en_progreso', 'resuelto', 'cerrado', 'rechazado')
      .optional(),
    
    priority: Joi.string()
      .valid('baja', 'media', 'alta', 'crítica')
      .optional(),
    
    category: Joi.string()
      .valid('hardware', 'software', 'red', 'seguridad', 'accesos', 'otros')
      .optional(),

    startDate: Joi.date()
      .iso()
      .optional(),

    endDate: Joi.date()
      .iso()
      .optional()
      .when('startDate', {
        is: Joi.exist(),
        then: Joi.date().min(Joi.ref('startDate'))
      }),

    page: Joi.number()
      .integer()
      .min(1)
      .default(1),

    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10),

    sortBy: Joi.string()
      .valid('createdAt', 'priority', 'status', 'dueDate', 'title')
      .default('createdAt'),

    sortOrder: Joi.string()
      .valid('asc', 'desc')
      .default('desc')
  })
});
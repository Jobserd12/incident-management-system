import Boom from '@hapi/boom';
import logger from '../logs/logger.js';
import { ERROR_MESSAGES } from '../api/constants/messages.js';

export const notFound = (req, res, next) => {
  next(Boom.notFound(`${ERROR_MESSAGES.RESOURCE.ROUTE_NOT_FOUND} - ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  // Log del error para debugging
  logger.error({
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Si ya es un error de Boom
  if (Boom.isBoom(err)) {
    return res.status(err.output.statusCode).json({
      status: 'error',
      message: err.message,
      details: err.data
    });
  }

  // Convertir otros errores a Boom
  const boomError = err.isBoom ? err : Boom.boomify(err, {
    statusCode: err.statusCode || 500,
    message: err.message || ERROR_MESSAGES.SERVER.INTERNAL
  });

  res.status(boomError.output.statusCode).json({
    status: 'error',
    message: boomError.message,
    details: boomError.data
  });
};

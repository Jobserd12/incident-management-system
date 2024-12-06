import { ERROR_MESSAGES } from '../api/constants/messages.js';
import logger from '../logs/logger.js';
import Boom from '@hapi/boom';

export const validateSchema = (schema) => {
  return (req, res, next) => {
    try {
      const dataToValidate = {
        body: req.body,
        query: req.query,
        params: req.params
      };

      const { error } = schema.validate(dataToValidate, { 
        abortEarly: false,
        allowUnknown: true
      });

      if (error) {
        logger.error(ERROR_MESSAGES.REQUEST.INVALID_INPUT, {
          error: error.details[0].message,
          path: req.originalUrl,
          data: dataToValidate
        });
        
        const errorMessage = error.details
          .map(detail => detail.message)
          .join(', ');
          
        throw Boom.badRequest(errorMessage);
      }
      
      next();
    } catch (error) {
      if (!error.isBoom) {
        error = Boom.badRequest(error.message);
      }
      next(error);
    }
  }; 
};
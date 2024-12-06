import Boom from '@hapi/boom';
import { INCIDENT_MESSAGES } from '../api/constants/messages.js';

export const validateFiles = (req, res, next) => {
  try {
    const isUpdate = req.method === 'PATCH';

    if (isUpdate) {
      if (!req.file) {
        throw Boom.badRequest('No se ha proporcionado un archivo para actualizar');
      }

      const file = req.file;
      validateSingleFile(file);
    } else {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        throw Boom.badRequest(INCIDENT_MESSAGES.ATTACHMENTS.NO_FILES);
      }

      if (req.files.length > 5) {
        throw Boom.badRequest('No puede subir más de 5 archivos en total');
      }
      req.files.forEach(file => validateSingleFile(file));
    }

    next();
  } catch (error) {
    next(error);
  }
};

const validateSingleFile = (file) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    throw Boom.badRequest(`Tipo de archivo no permitido: ${file.originalname}`);
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw Boom.badRequest(`El archivo ${file.originalname} excede el tamaño máximo permitido de 10MB`);
  }
};
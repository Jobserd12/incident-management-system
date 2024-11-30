import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Estas líneas son necesarias para obtener la ruta del directorio actual cuando se usa ES modules
// fileURLToPath convierte la URL del módulo a una ruta de sistema de archivos
// dirname obtiene el directorio que contiene el archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Formato personalizado para los logs
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta) : ''
    }`;
  })
);

// Crear el logger
const logger = winston.createLogger({
  format: customFormat,
  transports: [
    // Logs de error
    new winston.transports.File({
      filename: path.join(__dirname, './error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Logs de acceso
    new winston.transports.File({
      filename: path.join(__dirname, './access.log'),
      level: 'info',
    }),
    // Logs de seguridad
    new winston.transports.File({
      filename: path.join(__dirname, './security.log'),
      level: 'warn',
    }),
    // Todos los logs
    new winston.transports.File({
      filename: path.join(__dirname, './combined.log'),
    })
  ]
});

// Agregar logs a consola en desarrollo
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Funciones helper
logger.accessLog = (req, message) => {
  logger.info(message, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });
};

logger.securityLog = (req, message) => {
  logger.warn(message, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id
  });
};

export default logger;
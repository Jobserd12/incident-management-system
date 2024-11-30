import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const config = {
  env: process.env.NODE_ENV,
  baseUrl: process.env.BASE_URL,
  port: process.env.PORT || 3000,
  
  mongodb: {
    uri: process.env.MONGODB_URI
  },
  
  // JWT Authentication
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION || '1h'
  },

  // Logging
  logs: {
    level: process.env.LOG_LEVEL || 'info',
    path: path.join(__dirname, '../logs'),
    maxSize: process.env.LOG_MAX_SIZE || '5m',
    maxFiles: process.env.LOG_MAX_FILES || 5
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: process.env.RATE_LIMIT_MAX || 100
  },

  // Seguridad
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10'),
    corsOrigin: process.env.CORS_ORIGIN || '*',
    maxFileSize: process.env.MAX_FILE_SIZE || '5mb'
  },

  // Incidentes
  incidents: {
    maxAttachmentSize: process.env.MAX_ATTACHMENT_SIZE || '10mb',
    allowedFileTypes: process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,application/pdf',
    maxPriority: parseInt(process.env.MAX_INCIDENT_PRIORITY || '5')
  },

  auth: {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback'
    },
    session: {
      secret: process.env.SESSION_SECRET,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
      }
    },
    email: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
      from: process.env.EMAIL_FROM
    }
  }
};

// Validaciones según el entorno
if (config.env === 'production') {
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_EXPIRATION'
  ];
  
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      throw new Error(`Environment variable ${varName} is required in production`);
    }
  });
}

export default config; 
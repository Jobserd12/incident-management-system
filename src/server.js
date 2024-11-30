import express from 'express';
import connectDB from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import morgan from 'morgan';
import setupAPI from './api/routes/index.js';
import config from './config/config.js';
import passport from './middleware/passport/index.js';

const app = express();

// Middlewares según el entorno
if (config.env === 'development') {
  app.use(morgan('dev')); 
  console.log('Modo desarrollo activado - Logging detallado');
}
// Middlewares básicos con configuración según entorno
app.use(express.json({ 
  limit: config.security.maxFileSize 
}));
app.use(express.urlencoded({ 
  extended: true,
  limit: config.security.maxFileSize 
}));

app.use(passport.initialize());

// Conectar a la base de datos
try {
  await connectDB();
} catch (error) {
  console.error(`Error al conectar a la base de datos en modo ${config.env}:`, error);
  process.exit(1);
}

await setupAPI(app); 

// Middleware de errores debe ir al final
app.use(notFound);
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`Servidor corriendo en modo ${config.env}`);
  console.log(`URL: http://localhost:${config.port}`);
});

// Manejo de errores según el entorno
const handleError = (type, err) => {
  const message = `${type}! Cerrando servidor...`;
  
  if (config.env === 'development') {
    console.error(message, err);
  } else {
    console.error(message);
  }
  
  server.close(() => {
    process.exit(1);
  });
};

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => handleError('UNHANDLED REJECTION', err));
process.on('uncaughtException', (err) => handleError('UNCAUGHT EXCEPTION', err));

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido. Cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

export default app;
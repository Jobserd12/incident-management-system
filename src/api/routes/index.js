import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from '../../config/swagger.js';
import authRoutes from './auth.routes.js';
import incidentRoutes from './incident.routes.js';

const setupAPI = async (app) => {
  const router = Router();

  try {
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    router.use('/auth', authRoutes);
    router.use('/incidents', incidentRoutes);

    app.use('/api', router);

  } catch (error) {
    console.error('Error al configurar la API:', error);
    throw error; 
  }
};

export default setupAPI;
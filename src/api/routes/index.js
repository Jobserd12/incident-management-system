import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import boom from '@hapi/boom';
import swaggerOptions from '../../config/swagger.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import adminRoutes from './admin.routes.js';
import incidentRoutes from './incidents/index.js';

const setupAPI = async (app) => {
  const router = Router();

  try {
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    router.use('/admin', adminRoutes);
    router.use('/auth', authRoutes);
    router.use('/user', userRoutes);
    router.use('/incidents', incidentRoutes);

    app.use('/api', router);

  } catch (error) {
    throw boom.badImplementation('Error al configurar las rutas de la API');
  }
};

export default setupAPI;
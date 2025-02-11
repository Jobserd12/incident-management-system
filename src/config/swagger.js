import swaggerDocs from '../api/docs/index.js';

const swaggerOptions = {
  definition: swaggerDocs,
  apis: ['./src/api/routes/**/*.js'] // Busca archivos de rutas en todos los subdirectorios
};

export default swaggerOptions;
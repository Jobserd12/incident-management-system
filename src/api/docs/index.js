import config from '../../config/config.js';
import { authPaths, authSchemas } from './auth.swagger.js';
import { incidentPaths, incidentSchemas } from './incidents.swagger.js';
import { commentPaths, commentSchemas } from './comments.swagger.js';
import { attachmentPaths, attachmentSchemas } from './attachments.swagger.js';
import { relationshipPaths, relationshipSchemas } from './relationships.swagger.js';
import { assignmentPaths, assignmentSchemas } from './assignments.swagger.js';

const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Sistema de Gestión de Incidencias API',
    version: '1.0.0',
    description: `
      API REST para el Sistema de Gestión de Incidencias. 
      Esta API permite gestionar incidentes, usuarios, comentarios y archivos adjuntos de manera eficiente.
      
      ## Características principales:
      - Gestión completa de incidentes
      - Sistema de comentarios y seguimiento
      - Manejo de archivos adjuntos
      - Autenticación y autorización
      - Asignación y reasignación de incidentes
      - Gestión de relaciones entre incidentes
      - Gestión de carga de trabajo de técnicos
      
      ## Guía rápida:
      1. Regístrate o inicia sesión para obtener tu token JWT
      2. Usa el token en el encabezado de autorización
      3. Explora los endpoints disponibles según tu rol
    `,
    contact: {
      name: 'Equipo de Desarrollo',
      email: 'desarrollo@empresa.com',
      url: 'https://empresa.com/soporte'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: `http://localhost:${config.port}/api`,
      description: 'Servidor de Desarrollo'
    },
    {
      url: 'https://api.empresa.com/api',
      description: 'Servidor de Producción'
    }
  ],
  tags: [
    {
      name: 'Autenticación',
      description: 'Endpoints relacionados con registro, inicio de sesión y gestión de tokens'
    },
    {
      name: 'Incidentes',
      description: 'Gestión de incidentes: crear, listar, actualizar y eliminar'
    },
    {
      name: 'Comentarios',
      description: 'Sistema de comentarios para el seguimiento de incidentes'
    },
    {
      name: 'Archivos',
      description: 'Gestión de archivos adjuntos a incidentes y comentarios'
    },
    {
      name: 'Relaciones',
      description: 'Gestión de relaciones entre incidentes (duplicados, dependencias, etc.)'
    },
    {
      name: 'Asignaciones',
      description: 'Gestión de asignaciones y carga de trabajo de técnicos'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingrese su token JWT de autenticación'
      }
    },
    responses: {
      UnauthorizedError: {
        description: 'Error de autenticación - Token inválido o expirado',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  enum: ['error'],
                  example: 'error'
                },
                message: {
                  type: 'string',
                  example: 'Token inválido o expirado'
                }
              }
            }
          }
        }
      },
      ValidationError: {
        description: 'Error de validación en los datos de entrada',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  enum: ['error'],
                  example: 'error'
                },
                message: {
                  type: 'string',
                  example: 'Error de validación'
                },
                details: {
                  type: 'object',
                  example: {
                    field: ['mensaje de error']
                  }
                }
              }
            }
          }
        }
      }
    },
    schemas: {
      ...authSchemas,
      ...incidentSchemas,
      ...commentSchemas,
      ...attachmentSchemas,
      ...relationshipSchemas,
      ...assignmentSchemas
    }
  },
  paths: {
    ...authPaths,
    ...incidentPaths,
    ...commentPaths,
    ...attachmentPaths,
    ...relationshipPaths,
    ...assignmentPaths
  }
};

export default swaggerDocs; 

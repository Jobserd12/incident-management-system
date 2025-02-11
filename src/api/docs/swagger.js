import { incidentPaths, incidentSchemas } from './incidents.swagger.js';
import { relationshipPaths, relationshipSchemas } from './relationships.swagger.js';
import { commentPaths, commentSchemas } from './comments.swagger.js';
import { attachmentPaths, attachmentSchemas } from './attachments.swagger.js';
import { trackingPaths, trackingSchemas } from './tracking.swagger.js';
import { authPaths, authSchemas } from './auth.swagger.js';
import { assignmentPaths, assignmentSchemas } from './assignments.swagger.js';

const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'API de Sistema de Gestión de Incidentes',
    version: '1.0.0',
    description: 'API para gestionar incidentes, relaciones, comentarios, archivos adjuntos y seguimiento de tiempo'
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Servidor de desarrollo'
    }
  ],
  paths: {
    ...authPaths,
    ...incidentPaths,
    ...relationshipPaths,
    ...commentPaths,
    ...attachmentPaths,
    ...trackingPaths,
    ...assignmentPaths
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    responses: {
      UnauthorizedError: {
        description: 'No autorizado - Token inválido o expirado',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'error'
                },
                message: {
                  type: 'string',
                  example: 'No autorizado'
                }
              }
            }
          }
        }
      },
      ValidationError: {
        description: 'Error de validación en los datos enviados',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'error'
                },
                message: {
                  type: 'string',
                  example: 'Error de validación'
                },
                errors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: {
                        type: 'string'
                      },
                      message: {
                        type: 'string'
                      }
                    }
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
      ...relationshipSchemas,
      ...commentSchemas,
      ...attachmentSchemas,
      ...trackingSchemas,
      ...assignmentSchemas
    }
  }
}; 
import config from '../config/config.js';
import { ROLES, STATUS, PRIORITY } from './constants.js';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Gestión de Incidencias API',
      version: '1.0.0',
      description: 'API REST completa para el Sistema de Gestión de Incidencias. Permite gestionar usuarios, autenticación, incidentes y sus estados.',
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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingrese su token JWT'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              example: 'Descripción del error'
            },
            details: {
              type: 'object',
              example: {}
            }
          }
        },
        LoginInput: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'usuario@empresa.com',
              description: 'Correo electrónico del usuario'
            },
            password: {
              type: 'string',
              format: 'password',
              example: '********',
              description: 'Contraseña del usuario'
            }
          },
          required: ['email', 'password']
        },
        RegisterInput: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Juan Pérez',
              description: 'Nombre completo del usuario'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan.perez@empresa.com',
              description: 'Correo electrónico único del usuario'
            },
            password: {
              type: 'string',
              format: 'password',
              example: '********',
              description: 'Contraseña segura (mínimo 8 caracteres)'
            },
            role: {
              type: 'string',
              enum: Object.values(ROLES),
              example: ROLES.USUARIO,
              description: 'Rol del usuario en el sistema'
            }
          },
          required: ['name', 'email', 'password']
        },
        Incident: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              example: 'Error en sistema de login',
              description: 'Título descriptivo del incidente'
            },
            description: {
              type: 'string',
              example: 'Los usuarios no pueden acceder al sistema...',
              description: 'Descripción detallada del incidente'
            },
            status: {
              type: 'string',
              enum: Object.values(STATUS),
              example: STATUS.NUEVO,
              description: 'Estado actual del incidente'
            },
            priority: {
              type: 'string',
              enum: Object.values(PRIORITY),
              example: PRIORITY.ALTA,
              description: 'Prioridad del incidente'
            },
            assignedTo: {
              type: 'string',
              format: 'uuid',
              description: 'ID del usuario asignado'
            },
            attachments: {
              type: 'array',
              items: {
                type: 'string',
                format: 'binary'
              },
              description: 'Archivos adjuntos al incidente'
            }
          },
          required: ['title', 'description', 'priority']
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Error de autenticación',
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
                    example: 'Credenciales inválidas'
                  }
                }
              }
            }
          }
        }
      },
      requestBodies: {
        LoginRequest: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'usuario@ejemplo.com'
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    example: '12345678'
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }],
    paths: {
      '/auth/login': {
        post: {
          tags: ['Autenticación'],
          summary: 'Iniciar sesión',
          operationId: 'login',
          requestBody: {
            $ref: '#/components/requestBodies/LoginRequest'
          },
          responses: {
            '200': {
              description: 'Login exitoso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'string',
                        example: 'success'
                      },
                      data: {
                        type: 'object',
                        properties: {
                          token: {
                            type: 'string',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                          },
                          user: {
                            type: 'object',
                            properties: {
                              id: {
                                type: 'string',
                                format: 'uuid'
                              },
                              email: {
                                type: 'string',
                                format: 'email'
                              },
                              username: {
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
            '401': {
              $ref: '#/components/responses/UnauthorizedError'
            },
            '400': {
              description: 'Datos de entrada inválidos',
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
                        example: 'Datos de entrada inválidos'
                      },
                      details: {
                        type: 'object'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/auth/register': {
        post: {
          tags: ['Autenticación'],
          summary: 'Registrar nuevo usuario',
          description: 'Crea una nueva cuenta de usuario en el sistema',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RegisterInput'
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Usuario registrado exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'Usuario registrado exitosamente'
                      },
                      user: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                            format: 'uuid'
                          },
                          name: {
                            type: 'string'
                          },
                          email: {
                            type: 'string',
                            format: 'email'
                          },
                          role: {
                            type: 'string',
                            enum: Object.values(ROLES)
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Datos inválidos',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '409': {
              description: 'El email ya está registrado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/api/routes/*.js', './src/api/docs/*.yaml']
};

export default swaggerOptions;
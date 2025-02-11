import { ROLES } from '../../config/constants.js';

export const authPaths = {
  '/auth/login': {
    post: {
      tags: ['Autenticación'],
      summary: 'Iniciar sesión en el sistema',
      description: 'Permite a los usuarios acceder al sistema usando sus credenciales',
      operationId: 'login',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginInput'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Inicio de sesión exitoso',
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
                        description: 'Token JWT para autenticación',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                      },
                      user: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Identificador único del usuario'
                          },
                          email: {
                            type: 'string',
                            format: 'email',
                            description: 'Correo electrónico del usuario'
                          },
                          name: {
                            type: 'string',
                            description: 'Nombre completo del usuario'
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
        }
      }
    }
  },
  '/auth/register': {
    post: {
      tags: ['Autenticación'],
      summary: 'Registrar nuevo usuario',
      description: 'Permite crear una nueva cuenta de usuario en el sistema',
      operationId: 'register',
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
                  status: {
                    type: 'string',
                    example: 'success'
                  },
                  message: {
                    type: 'string',
                    example: 'Usuario registrado exitosamente'
                  },
                  data: {
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
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '400': {
          $ref: '#/components/responses/ValidationError'
        }
      }
    }
  },
  '/auth/verify-email': {
    get: {
      tags: ['Autenticación'],
      summary: 'Verificar correo electrónico',
      description: 'Verifica el correo electrónico del usuario usando el token enviado por email',
      parameters: [
        {
          in: 'query',
          name: 'token',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Token de verificación enviado por correo'
        }
      ],
      responses: {
        '200': {
          description: 'Correo verificado exitosamente',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'success'
                  },
                  message: {
                    type: 'string',
                    example: 'Correo electrónico verificado exitosamente'
                  }
                }
              }
            }
          }
        },
        '400': {
          $ref: '#/components/responses/ValidationError'
        }
      }
    }
  }
};

export const authSchemas = {
  LoginInput: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'Correo electrónico del usuario',
        example: 'usuario@empresa.com'
      },
      password: {
        type: 'string',
        format: 'password',
        description: 'Contraseña del usuario',
        example: '********'
      }
    }
  },
  RegisterInput: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: {
        type: 'string',
        description: 'Nombre completo del usuario',
        example: 'Juan Pérez'
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Correo electrónico único del usuario',
        example: 'juan.perez@empresa.com'
      },
      password: {
        type: 'string',
        format: 'password',
        description: 'Contraseña segura (mínimo 8 caracteres)',
        example: '********'
      },
      role: {
        type: 'string',
        enum: Object.values(ROLES),
        description: 'Rol del usuario en el sistema (opcional)',
        example: ROLES.USUARIO
      }
    }
  }
}; 
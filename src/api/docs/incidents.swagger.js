import { STATUS, PRIORITY } from '../../config/constants.js';

// Primero definimos el esquema base de IncidentResponse
const baseIncidentResponse = {
  id: {
    type: 'string',
    format: 'uuid',
    description: 'Identificador único del incidente'
  },
  title: {
    type: 'string',
    description: 'Título del incidente'
  },
  description: {
    type: 'string',
    description: 'Descripción del incidente'
  },
  status: {
    type: 'string',
    enum: Object.values(STATUS),
    description: 'Estado actual del incidente'
  },
  priority: {
    type: 'string',
    enum: Object.values(PRIORITY),
    description: 'Prioridad del incidente'
  },
  createdBy: {
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
    },
    description: 'Usuario que creó el incidente'
  },
  assignedTo: {
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
    },
    description: 'Usuario asignado al incidente'
  },
  createdAt: {
    type: 'string',
    format: 'date-time',
    description: 'Fecha y hora de creación'
  },
  updatedAt: {
    type: 'string',
    format: 'date-time',
    description: 'Última fecha de actualización'
  }
};

export const incidentPaths = {
  '/incidents': {
    post: {
      tags: ['Incidentes'],
      summary: 'Crear nuevo incidente',
      description: 'Permite crear un nuevo incidente en el sistema',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateIncidentInput'
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'Incidente creado exitosamente',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/IncidentResponse'
              }
            }
          }
        },
        '400': {
          $ref: '#/components/responses/ValidationError'
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError'
        }
      }
    },
    get: {
      tags: ['Incidentes'],
      summary: 'Listar incidentes',
      description: 'Obtiene una lista paginada de incidentes con filtros opcionales',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'query',
          name: 'page',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          },
          description: 'Número de página'
        },
        {
          in: 'query',
          name: 'limit',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10
          },
          description: 'Cantidad de elementos por página'
        },
        {
          in: 'query',
          name: 'status',
          schema: {
            type: 'string',
            enum: Object.values(STATUS)
          },
          description: 'Filtrar por estado del incidente'
        },
        {
          in: 'query',
          name: 'priority',
          schema: {
            type: 'string',
            enum: Object.values(PRIORITY)
          },
          description: 'Filtrar por prioridad'
        }
      ],
      responses: {
        '200': {
          description: 'Lista de incidentes obtenida exitosamente',
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
                      incidents: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/IncidentResponse'
                        }
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          total: {
                            type: 'integer',
                            description: 'Total de incidentes'
                          },
                          pages: {
                            type: 'integer',
                            description: 'Total de páginas'
                          },
                          currentPage: {
                            type: 'integer',
                            description: 'Página actual'
                          },
                          limit: {
                            type: 'integer',
                            description: 'Elementos por página'
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
  '/incidents/{incidentId}': {
    get: {
      tags: ['Incidentes'],
      summary: 'Obtener incidente específico',
      description: 'Obtiene los detalles completos de un incidente específico',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'incidentId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'ID del incidente a consultar'
        }
      ],
      responses: {
        '200': {
          description: 'Incidente encontrado exitosamente',
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
                    $ref: '#/components/schemas/IncidentDetailResponse'
                  }
                }
              }
            }
          }
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError'
        },
        '404': {
          description: 'Incidente no encontrado',
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
                    example: 'Incidente no encontrado'
                  }
                }
              }
            }
          }
        }
      }
    },
    patch: {
      tags: ['Incidentes'],
      summary: 'Actualizar incidente',
      description: 'Actualiza la información de un incidente existente',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'incidentId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'ID del incidente a actualizar'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateIncidentInput'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Incidente actualizado exitosamente',
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
                    $ref: '#/components/schemas/IncidentResponse'
                  }
                }
              }
            }
          }
        },
        '400': {
          $ref: '#/components/responses/ValidationError'
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError'
        },
        '404': {
          description: 'Incidente no encontrado'
        }
      }
    }
  }
};

export const incidentSchemas = {
  CreateIncidentInput: {
    type: 'object',
    required: ['title', 'description', 'priority'],
    properties: {
      title: {
        type: 'string',
        description: 'Título descriptivo del incidente',
        example: 'Error en sistema de login'
      },
      description: {
        type: 'string',
        description: 'Descripción detallada del problema',
        example: 'Los usuarios no pueden acceder al sistema desde las 9:00 AM'
      },
      priority: {
        type: 'string',
        enum: Object.values(PRIORITY),
        description: 'Nivel de prioridad del incidente',
        example: PRIORITY.ALTA
      },
      attachments: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary'
        },
        description: 'Archivos adjuntos relacionados con el incidente'
      }
    }
  },
  UpdateIncidentInput: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Nuevo título del incidente',
        example: 'Error crítico en sistema de login'
      },
      description: {
        type: 'string',
        description: 'Nueva descripción del incidente',
        example: 'Se ha identificado que el problema afecta a todos los usuarios desde las 9:00 AM'
      },
      status: {
        type: 'string',
        enum: Object.values(STATUS),
        description: 'Nuevo estado del incidente',
        example: STATUS.EN_PROGRESO
      },
      priority: {
        type: 'string',
        enum: Object.values(PRIORITY),
        description: 'Nueva prioridad del incidente',
        example: PRIORITY.CRITICA
      }
    }
  },
  IncidentResponse: {
    type: 'object',
    properties: baseIncidentResponse
  },
  IncidentDetailResponse: {
    type: 'object',
    properties: {
      ...baseIncidentResponse,
      comments: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/CommentResponse'
        },
        description: 'Lista de comentarios del incidente'
      },
      attachments: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/AttachmentResponse'
        },
        description: 'Lista de archivos adjuntos'
      },
      history: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              description: 'Tipo de acción realizada',
              example: 'status_changed'
            },
            from: {
              type: 'string',
              description: 'Valor anterior',
              example: STATUS.NUEVO
            },
            to: {
              type: 'string',
              description: 'Valor nuevo',
              example: STATUS.EN_PROGRESO
            },
            by: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid'
                },
                name: {
                  type: 'string'
                }
              },
              description: 'Usuario que realizó el cambio'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha y hora del cambio'
            }
          }
        },
        description: 'Historial de cambios del incidente'
      }
    }
  }
}; 
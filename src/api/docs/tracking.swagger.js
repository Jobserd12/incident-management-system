export const trackingPaths = {
  '/incidents/{incidentId}/start-work': {
    patch: {
      tags: ['Seguimiento de Tiempo'],
      summary: 'Iniciar trabajo',
      description: 'Inicia el registro de tiempo de trabajo en un incidente',
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
          description: 'ID del incidente en el que se iniciará el trabajo'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/StartWorkInput'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Trabajo iniciado exitosamente',
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
                    $ref: '#/components/schemas/WorkSessionResponse'
                  }
                }
              }
            }
          }
        },
        '400': {
          description: 'Error de validación o sesión ya iniciada',
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
                    example: 'Ya existe una sesión de trabajo activa'
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
          description: 'Incidente no encontrado'
        }
      }
    }
  },
  '/incidents/{incidentId}/pause-work': {
    patch: {
      tags: ['Seguimiento de Tiempo'],
      summary: 'Pausar trabajo',
      description: 'Pausa o finaliza el registro de tiempo de trabajo en un incidente',
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
          description: 'ID del incidente en el que se pausará el trabajo'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/PauseWorkInput'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Trabajo pausado exitosamente',
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
                    $ref: '#/components/schemas/WorkSessionResponse'
                  }
                }
              }
            }
          }
        },
        '400': {
          description: 'Error de validación o no hay sesión activa',
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
                    example: 'No existe una sesión de trabajo activa'
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
          description: 'Incidente no encontrado'
        }
      }
    }
  },
  '/incidents/metrics/time': {
    get: {
      tags: ['Seguimiento de Tiempo'],
      summary: 'Obtener métricas de tiempo',
      description: 'Obtiene estadísticas y métricas relacionadas con el tiempo de trabajo en incidentes',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'query',
          name: 'startDate',
          schema: {
            type: 'string',
            format: 'date'
          },
          description: 'Fecha inicial para filtrar las métricas (YYYY-MM-DD)'
        },
        {
          in: 'query',
          name: 'endDate',
          schema: {
            type: 'string',
            format: 'date'
          },
          description: 'Fecha final para filtrar las métricas (YYYY-MM-DD)'
        },
        {
          in: 'query',
          name: 'technicianId',
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'ID del técnico para filtrar las métricas'
        }
      ],
      responses: {
        '200': {
          description: 'Métricas obtenidas exitosamente',
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
                    $ref: '#/components/schemas/TimeMetricsResponse'
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
  }
};

export const trackingSchemas = {
  StartWorkInput: {
    type: 'object',
    required: ['notes'],
    properties: {
      notes: {
        type: 'string',
        description: 'Notas sobre el trabajo a realizar',
        example: 'Iniciando diagnóstico del problema'
      }
    }
  },
  PauseWorkInput: {
    type: 'object',
    required: ['notes', 'type'],
    properties: {
      notes: {
        type: 'string',
        description: 'Notas sobre el trabajo realizado',
        example: 'Se completó la primera fase del diagnóstico'
      },
      type: {
        type: 'string',
        enum: ['pause', 'complete'],
        description: 'Tipo de pausa: temporal o finalización',
        example: 'pause'
      }
    }
  },
  WorkSessionResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Identificador único de la sesión de trabajo'
      },
      incidentId: {
        type: 'string',
        format: 'uuid',
        description: 'ID del incidente asociado'
      },
      technicianId: {
        type: 'string',
        format: 'uuid',
        description: 'ID del técnico que realizó el trabajo'
      },
      startTime: {
        type: 'string',
        format: 'date-time',
        description: 'Fecha y hora de inicio del trabajo'
      },
      endTime: {
        type: 'string',
        format: 'date-time',
        description: 'Fecha y hora de finalización del trabajo'
      },
      duration: {
        type: 'integer',
        description: 'Duración en minutos de la sesión de trabajo'
      },
      notes: {
        type: 'string',
        description: 'Notas asociadas a la sesión'
      },
      status: {
        type: 'string',
        enum: ['active', 'paused', 'completed'],
        description: 'Estado actual de la sesión'
      }
    }
  },
  TimeMetricsResponse: {
    type: 'object',
    properties: {
      totalWorkTime: {
        type: 'integer',
        description: 'Tiempo total de trabajo en minutos'
      },
      averageSessionDuration: {
        type: 'integer',
        description: 'Duración promedio de las sesiones en minutos'
      },
      totalSessions: {
        type: 'integer',
        description: 'Número total de sesiones de trabajo'
      },
      timeByStatus: {
        type: 'object',
        properties: {
          active: {
            type: 'integer',
            description: 'Tiempo total en sesiones activas'
          },
          paused: {
            type: 'integer',
            description: 'Tiempo total en sesiones pausadas'
          },
          completed: {
            type: 'integer',
            description: 'Tiempo total en sesiones completadas'
          }
        }
      },
      timeByPriority: {
        type: 'object',
        properties: {
          high: {
            type: 'integer',
            description: 'Tiempo total en incidentes de alta prioridad'
          },
          medium: {
            type: 'integer',
            description: 'Tiempo total en incidentes de media prioridad'
          },
          low: {
            type: 'integer',
            description: 'Tiempo total en incidentes de baja prioridad'
          }
        }
      },
      activeSessions: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/WorkSessionResponse'
        },
        description: 'Lista de sesiones actualmente activas'
      }
    }
  }
}; 
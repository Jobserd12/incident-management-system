export const assignmentPaths = {
  '/incidents/{incidentId}/assign': {
    patch: {
      tags: ['Asignaciones'],
      summary: 'Asignar incidente',
      description: 'Asigna un incidente a un técnico de soporte',
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
          description: 'ID del incidente a asignar'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AssignIncidentInput'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Incidente asignado exitosamente',
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
          description: 'Incidente o técnico no encontrado'
        }
      }
    }
  },
  '/incidents/{incidentId}/reassign': {
    patch: {
      tags: ['Asignaciones'],
      summary: 'Reasignar incidente',
      description: 'Reasigna un incidente a un nuevo técnico de soporte',
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
          description: 'ID del incidente a reasignar'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ReassignIncidentInput'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Incidente reasignado exitosamente',
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
          description: 'Incidente o técnico no encontrado'
        }
      }
    }
  },
  '/incidents/technician/{technicianId}/incidents': {
    get: {
      tags: ['Asignaciones'],
      summary: 'Obtener incidentes de técnico',
      description: 'Obtiene la lista de incidentes asignados a un técnico específico',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'technicianId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'ID del técnico'
        },
        {
          in: 'query',
          name: 'status',
          schema: {
            type: 'string',
            enum: ['nuevo', 'en_progreso', 'resuelto', 'cerrado']
          },
          description: 'Filtrar por estado de los incidentes'
        },
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
        },
        '404': {
          description: 'Técnico no encontrado'
        }
      }
    }
  },
  '/incidents/technician/{technicianId}/workload': {
    get: {
      tags: ['Asignaciones'],
      summary: 'Obtener carga de trabajo',
      description: 'Obtiene estadísticas sobre la carga de trabajo actual de un técnico',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'technicianId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'ID del técnico'
        }
      ],
      responses: {
        '200': {
          description: 'Estadísticas obtenidas exitosamente',
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
                    $ref: '#/components/schemas/WorkloadStats'
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
          description: 'Técnico no encontrado'
        }
      }
    }
  }
};

export const assignmentSchemas = {
  AssignIncidentInput: {
    type: 'object',
    required: ['technicianId'],
    properties: {
      technicianId: {
        type: 'string',
        format: 'uuid',
        description: 'ID del técnico al que se asignará el incidente',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      notes: {
        type: 'string',
        description: 'Notas opcionales sobre la asignación',
        example: 'Asignado por experiencia previa en problemas similares'
      }
    }
  },
  ReassignIncidentInput: {
    type: 'object',
    required: ['technicianId', 'reason'],
    properties: {
      technicianId: {
        type: 'string',
        format: 'uuid',
        description: 'ID del nuevo técnico',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      reason: {
        type: 'string',
        description: 'Motivo de la reasignación',
        example: 'El técnico actual está de vacaciones'
      },
      notes: {
        type: 'string',
        description: 'Notas adicionales sobre la reasignación',
        example: 'Se requiere atención inmediata'
      }
    }
  },
  WorkloadStats: {
    type: 'object',
    properties: {
      totalAssigned: {
        type: 'integer',
        description: 'Total de incidentes asignados',
        example: 15
      },
      byStatus: {
        type: 'object',
        properties: {
          nuevo: {
            type: 'integer',
            description: 'Incidentes nuevos',
            example: 3
          },
          en_progreso: {
            type: 'integer',
            description: 'Incidentes en progreso',
            example: 8
          },
          resuelto: {
            type: 'integer',
            description: 'Incidentes resueltos',
            example: 4
          }
        }
      },
      byPriority: {
        type: 'object',
        properties: {
          alta: {
            type: 'integer',
            description: 'Incidentes de alta prioridad',
            example: 5
          },
          media: {
            type: 'integer',
            description: 'Incidentes de prioridad media',
            example: 7
          },
          baja: {
            type: 'integer',
            description: 'Incidentes de baja prioridad',
            example: 3
          }
        }
      },
      averageResolutionTime: {
        type: 'number',
        description: 'Tiempo promedio de resolución en horas',
        example: 24.5
      },
      currentLoad: {
        type: 'number',
        description: 'Porcentaje de carga de trabajo actual',
        example: 75.5
      }
    }
  }
}; 
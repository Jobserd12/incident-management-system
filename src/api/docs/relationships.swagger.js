export const relationshipPaths = {
  '/incidents/{incidentId}/relationships': {
    post: {
      tags: ['Relaciones'],
      summary: 'Vincular incidentes',
      description: 'Establece una relación entre dos incidentes, definiendo uno como padre y otro como hijo',
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
          description: 'ID del incidente padre'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LinkIncidentInput'
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'Relación creada exitosamente',
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
                    $ref: '#/components/schemas/RelationshipResponse'
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
        },
        '409': {
          description: 'Relación circular o ya existente',
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
                    example: 'No se puede crear una relación circular entre incidentes'
                  }
                }
              }
            }
          }
        }
      }
    },
    get: {
      tags: ['Relaciones'],
      summary: 'Obtener relaciones',
      description: 'Obtiene todas las relaciones de un incidente (tanto padres como hijos)',
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
          description: 'ID del incidente'
        },
        {
          in: 'query',
          name: 'type',
          schema: {
            type: 'string',
            enum: ['parent', 'child', 'all'],
            default: 'all'
          },
          description: 'Filtrar por tipo de relación'
        }
      ],
      responses: {
        '200': {
          description: 'Relaciones obtenidas exitosamente',
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
                      parents: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/RelationshipResponse'
                        },
                        description: 'Incidentes padre'
                      },
                      children: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/RelationshipResponse'
                        },
                        description: 'Incidentes hijo'
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
          description: 'Incidente no encontrado'
        }
      }
    }
  },
  '/incidents/{incidentId}/relationships/{childId}': {
    delete: {
      tags: ['Relaciones'],
      summary: 'Desvincular incidentes',
      description: 'Elimina la relación entre dos incidentes',
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
          description: 'ID del incidente padre'
        },
        {
          in: 'path',
          name: 'childId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'ID del incidente hijo'
        }
      ],
      responses: {
        '200': {
          description: 'Relación eliminada exitosamente',
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
                    example: 'Relación eliminada exitosamente'
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
          description: 'Incidente o relación no encontrada'
        }
      }
    },
    patch: {
      tags: ['Relaciones'],
      summary: 'Actualizar tipo de relación',
      description: 'Modifica el tipo de relación entre dos incidentes',
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
          description: 'ID del incidente padre'
        },
        {
          in: 'path',
          name: 'childId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'ID del incidente hijo'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateRelationshipInput'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Relación actualizada exitosamente',
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
                    $ref: '#/components/schemas/RelationshipResponse'
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
          description: 'Incidente o relación no encontrada'
        }
      }
    }
  }
};

export const relationshipSchemas = {
  LinkIncidentInput: {
    type: 'object',
    required: ['childId', 'type'],
    properties: {
      childId: {
        type: 'string',
        format: 'uuid',
        description: 'ID del incidente hijo',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      type: {
        type: 'string',
        enum: ['duplicado', 'relacionado', 'dependiente', 'bloqueante'],
        description: 'Tipo de relación entre los incidentes',
        example: 'dependiente'
      },
      description: {
        type: 'string',
        description: 'Descripción opcional de la relación',
        example: 'Este incidente debe resolverse antes que el incidente hijo'
      }
    }
  },
  UpdateRelationshipInput: {
    type: 'object',
    required: ['type'],
    properties: {
      type: {
        type: 'string',
        enum: ['duplicado', 'relacionado', 'dependiente', 'bloqueante'],
        description: 'Nuevo tipo de relación',
        example: 'bloqueante'
      },
      description: {
        type: 'string',
        description: 'Nueva descripción de la relación',
        example: 'Este incidente bloquea la resolución del incidente hijo'
      }
    }
  },
  RelationshipResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'ID único de la relación'
      },
      parentIncident: {
        $ref: '#/components/schemas/IncidentResponse',
        description: 'Detalles del incidente padre'
      },
      childIncident: {
        $ref: '#/components/schemas/IncidentResponse',
        description: 'Detalles del incidente hijo'
      },
      type: {
        type: 'string',
        enum: ['duplicado', 'relacionado', 'dependiente', 'bloqueante'],
        description: 'Tipo de relación'
      },
      description: {
        type: 'string',
        description: 'Descripción de la relación'
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
          }
        },
        description: 'Usuario que creó la relación'
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Fecha y hora de creación de la relación'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Última fecha de actualización de la relación'
      }
    }
  }
}; 
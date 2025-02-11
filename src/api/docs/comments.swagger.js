export const commentPaths = {
  '/incidents/{incidentId}/comments': {
    post: {
      tags: ['Comentarios'],
      summary: 'Agregar comentario',
      description: 'Agrega un nuevo comentario a un incidente específico',
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
          description: 'ID del incidente al que se agregará el comentario'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AddCommentInput'
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'Comentario agregado exitosamente',
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
                    $ref: '#/components/schemas/CommentResponse'
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
    },
    get: {
      tags: ['Comentarios'],
      summary: 'Listar comentarios',
      description: 'Obtiene la lista de comentarios de un incidente específico',
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
          description: 'Cantidad de comentarios por página'
        },
        {
          in: 'query',
          name: 'sortBy',
          schema: {
            type: 'string',
            enum: ['createdAt', 'updatedAt'],
            default: 'createdAt'
          },
          description: 'Campo por el cual ordenar los comentarios'
        },
        {
          in: 'query',
          name: 'order',
          schema: {
            type: 'string',
            enum: ['asc', 'desc'],
            default: 'desc'
          },
          description: 'Orden de los comentarios (ascendente o descendente)'
        }
      ],
      responses: {
        '200': {
          description: 'Lista de comentarios obtenida exitosamente',
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
                      comments: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/CommentResponse'
                        }
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          total: {
                            type: 'integer',
                            description: 'Total de comentarios'
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
          description: 'Incidente no encontrado'
        }
      }
    }
  },
  '/incidents/{incidentId}/comments/{commentId}': {
    patch: {
      tags: ['Comentarios'],
      summary: 'Actualizar comentario',
      description: 'Modifica el contenido de un comentario existente',
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
          in: 'path',
          name: 'commentId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'ID del comentario a actualizar'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateCommentInput'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Comentario actualizado exitosamente',
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
                    $ref: '#/components/schemas/CommentResponse'
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
        '403': {
          description: 'No tiene permisos para editar este comentario'
        },
        '404': {
          description: 'Incidente o comentario no encontrado'
        }
      }
    },
    delete: {
      tags: ['Comentarios'],
      summary: 'Eliminar comentario',
      description: 'Elimina un comentario específico del incidente',
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
          in: 'path',
          name: 'commentId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'ID del comentario a eliminar'
        }
      ],
      responses: {
        '200': {
          description: 'Comentario eliminado exitosamente',
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
                    example: 'Comentario eliminado exitosamente'
                  }
                }
              }
            }
          }
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError'
        },
        '403': {
          description: 'No tiene permisos para eliminar este comentario'
        },
        '404': {
          description: 'Incidente o comentario no encontrado'
        }
      }
    }
  }
};

export const commentSchemas = {
  AddCommentInput: {
    type: 'object',
    required: ['content'],
    properties: {
      content: {
        type: 'string',
        description: 'Contenido del comentario',
        example: 'Se ha identificado la causa del problema y se está trabajando en la solución'
      },
      visibility: {
        type: 'string',
        enum: ['public', 'private', 'internal'],
        description: 'Nivel de visibilidad del comentario',
        default: 'public',
        example: 'public'
      },
      attachments: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary'
        },
        description: 'Archivos adjuntos al comentario'
      }
    }
  },
  UpdateCommentInput: {
    type: 'object',
    required: ['content'],
    properties: {
      content: {
        type: 'string',
        description: 'Nuevo contenido del comentario',
        example: 'Actualización: La solución está siendo implementada'
      },
      visibility: {
        type: 'string',
        enum: ['public', 'private', 'internal'],
        description: 'Nuevo nivel de visibilidad del comentario',
        example: 'internal'
      }
    }
  },
  CommentResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Identificador único del comentario'
      },
      content: {
        type: 'string',
        description: 'Contenido del comentario'
      },
      visibility: {
        type: 'string',
        enum: ['public', 'private', 'internal'],
        description: 'Nivel de visibilidad del comentario'
      },
      author: {
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
            type: 'string'
          }
        },
        description: 'Usuario que creó el comentario'
      },
      attachments: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/AttachmentResponse'
        },
        description: 'Archivos adjuntos al comentario'
      },
      edited: {
        type: 'boolean',
        description: 'Indica si el comentario ha sido editado'
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
    }
  }
}; 
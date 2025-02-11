export const attachmentPaths = {
  '/incidents/{incidentId}/attachments': {
    post: {
      tags: ['Archivos Adjuntos'],
      summary: 'Subir archivos adjuntos',
      description: 'Sube uno o más archivos adjuntos a un incidente específico (máximo 5 archivos)',
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
          description: 'ID del incidente al que se agregarán los archivos'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['attachments'],
              properties: {
                attachments: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'binary'
                  },
                  maxItems: 5,
                  description: 'Archivos a subir (máximo 5)'
                }
              }
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'Archivos subidos exitosamente',
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
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/AttachmentResponse'
                    }
                  }
                }
              }
            }
          }
        },
        '400': {
          description: 'Error de validación o archivos inválidos',
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
                    example: 'Formato de archivo no permitido o tamaño excedido'
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
          description: 'No tiene permisos para subir archivos'
        },
        '404': {
          description: 'Incidente no encontrado'
        }
      }
    },
    get: {
      tags: ['Archivos Adjuntos'],
      summary: 'Listar archivos adjuntos',
      description: 'Obtiene la lista de archivos adjuntos de un incidente específico',
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
          description: 'Cantidad de archivos por página'
        }
      ],
      responses: {
        '200': {
          description: 'Lista de archivos obtenida exitosamente',
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
                      attachments: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/AttachmentResponse'
                        }
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          total: {
                            type: 'integer',
                            description: 'Total de archivos'
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
        '403': {
          description: 'No tiene permisos para ver los archivos'
        },
        '404': {
          description: 'Incidente no encontrado'
        }
      }
    }
  },
  '/incidents/{incidentId}/attachments/{attachmentId}': {
    get: {
      tags: ['Archivos Adjuntos'],
      summary: 'Obtener archivo adjunto',
      description: 'Obtiene un archivo adjunto específico',
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
          name: 'attachmentId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'ID del archivo adjunto'
        }
      ],
      responses: {
        '200': {
          description: 'Archivo obtenido exitosamente',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AttachmentResponse'
              }
            }
          }
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError'
        },
        '403': {
          description: 'No tiene permisos para ver este archivo'
        },
        '404': {
          description: 'Incidente o archivo no encontrado'
        }
      }
    },
    delete: {
      tags: ['Archivos Adjuntos'],
      summary: 'Eliminar archivo adjunto',
      description: 'Elimina un archivo adjunto específico',
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
          name: 'attachmentId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'ID del archivo a eliminar'
        }
      ],
      responses: {
        '200': {
          description: 'Archivo eliminado exitosamente',
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
                    example: 'Archivo eliminado exitosamente'
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
          description: 'No tiene permisos para eliminar este archivo'
        },
        '404': {
          description: 'Incidente o archivo no encontrado'
        }
      }
    },
    patch: {
      tags: ['Archivos Adjuntos'],
      summary: 'Actualizar archivo adjunto',
      description: 'Actualiza un archivo adjunto existente',
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
          name: 'attachmentId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'ID del archivo a actualizar'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['attachment'],
              properties: {
                attachment: {
                  type: 'string',
                  format: 'binary',
                  description: 'Nuevo archivo'
                }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Archivo actualizado exitosamente',
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
                    $ref: '#/components/schemas/AttachmentResponse'
                  }
                }
              }
            }
          }
        },
        '400': {
          description: 'Error de validación o archivo inválido'
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError'
        },
        '403': {
          description: 'No tiene permisos para actualizar este archivo'
        },
        '404': {
          description: 'Incidente o archivo no encontrado'
        }
      }
    }
  }
};

export const attachmentSchemas = {
  AttachmentResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Identificador único del archivo'
      },
      filename: {
        type: 'string',
        description: 'Nombre original del archivo'
      },
      url: {
        type: 'string',
        format: 'uri',
        description: 'URL de acceso al archivo'
      },
      mimeType: {
        type: 'string',
        description: 'Tipo MIME del archivo'
      },
      size: {
        type: 'integer',
        description: 'Tamaño del archivo en bytes'
      },
      uploadedBy: {
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
        description: 'Usuario que subió el archivo'
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Fecha y hora de subida'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Última fecha de actualización'
      }
    }
  }
}; 
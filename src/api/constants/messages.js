export const AUTH_MESSAGES = {
  LOGIN: {
    SUCCESS: 'Inicio de sesión exitoso',
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    INCORRECT_PASSWORD: 'Contraseña incorrecta',
    UNVERIFIED_ACCOUNT: 'Por favor verifica tu cuenta primero'
  },
  
  REGISTER: {
    SUCCESS: 'Usuario registrado. Por favor verifica tu correo electrónico.',
    TEST_SUCCESS: 'Usuario de prueba registrado. Usa el enlace de verificación proporcionado.',
    EMAIL_EXISTS: 'El email ya está registrado',
    USERNAME_TAKEN: 'El nombre de usuario ya está en uso'
  },
  
  EMAIL: {
    VERIFICATION: {
      SUCCESS: 'Email verificado correctamente',
      INVALID_TOKEN: 'Token de verificación inválido o expirado',
      ALREADY_VERIFIED: 'El email ya está verificado',
      SENT: 'Se ha enviado un correo de verificación',
      TEST_NOTE: 'Este enlace de verificación solo se proporciona porque usaste un email de prueba',
      SENT_NOTE: 'Se ha enviado un enlace de verificación a tu correo electrónico'
    },
    RESEND: {
      SUCCESS: 'Email de verificación reenviado',
      LIMIT_REACHED: 'Has alcanzado el límite de reenvíos (3 intentos). Podrás solicitar nuevamente después de 24 horas',
      COOLDOWN: 'Debes esperar 15 minutos entre cada reenvío',
      AVAILABLE: '¿No recibiste el email? Puedes solicitar uno nuevo'
    },
    CHANGE: {
      SUCCESS: 'Email cambiado correctamente',
      VERIFICATION_SENT: 'Se ha enviado un correo de verificación para tu nuevo email',
      EMAIL_EXISTS: 'El email ya está en uso',
      SAME_EMAIL: 'El nuevo email no puede ser el mismo que el actual',
      INVALID_TOKEN: 'Token de verificación inválido o expirado',
      LIMIT_REACHED: 'Has alcanzado el límite de cambios (3 intentos). Podrás cambiar tu email nuevamente después de 24 horas',
      COOLDOWN: 'Debes esperar 15 minutos entre cada cambio de email'
    }
  },
  
  PASSWORD: {
    RESET: {
      SUCCESS: 'Contraseña actualizada correctamente',
      LINK_SENT: 'Se ha enviado un enlace para restablecer tus credenciales',
      INVALID_TOKEN: 'Token de recuperación inválido o expirado',
      SAME_PASSWORD: 'La nueva contraseña no puede ser la misma que la actual'
    },
    CHANGE: {
      SUCCESS: 'Contraseña cambiada correctamente',
      MISMATCH: 'Las contraseñas no coinciden',
      INVALID_CURRENT: 'Contraseña actual incorrecta',
      SAME_PASSWORD: 'La nueva contraseña no puede ser la misma que la actual',
      LIMIT_REACHED: 'Has alcanzado el límite de cambios (3 intentos). Podrás cambiar tu contraseña nuevamente después de 24 horas',
      COOLDOWN: 'Debes esperar 15 minutos entre cada cambio de contraseña'
    }
  },
  
  TOKEN: {
    INVALID: 'Token inválido o expirado',
    VERIFICATION_ERROR: 'Error en verificación de token'
  },
  
  USER: {
    NOT_FOUND: 'Usuario no encontrado',
    UNAUTHORIZED: 'No autorizado para realizar esta acción',
    FORBIDDEN: 'No tienes permisos para realizar esta acción'
  },
  
  GOOGLE: {
    SUCCESS: 'Inicio de sesión con Google exitoso',
    ERROR: 'Error al autenticar con Google'
  }
};

export const ERROR_MESSAGES = {
  SERVER: {
    INTERNAL: 'Error interno del servidor',
    DATABASE: 'Error en la base de datos',
    EMAIL_SEND: 'Error al enviar el correo electrónico'
  },
  
  REQUEST: {
    INVALID_INPUT: 'Datos de entrada inválidos',
    MISSING_FIELDS: 'Faltan campos requeridos',
    INVALID_FORMAT: 'Formato inválido',
    TOO_MANY_REQUESTS: 'Demasiadas solicitudes, intente más tarde',
    PAYLOAD_TOO_LARGE: 'El archivo es demasiado grande',
    METHOD_NOT_ALLOWED: 'Método no permitido'
  },
  
  RESOURCE: {
    NOT_FOUND: 'Recurso no encontrado',
    ROUTE_NOT_FOUND: 'Ruta no encontrada'
  }
};

export const SUCCESS_MESSAGES = {
  CRUD: {
    CREATE: 'Recurso creado exitosamente',
    READ: 'Datos recuperados exitosamente',
    UPDATE: 'Recurso actualizado exitosamente',
    DELETE: 'Recurso eliminado exitosamente'
  }
};

export const STATUS_MESSAGES = {
  PENDING: 'Pendiente',
  PROCESSING: 'En proceso',
  COMPLETED: 'Completado',
  FAILED: 'Fallido'
};

export const INCIDENT_MESSAGES = {
  CREATE: {
    SUCCESS: 'Incidencia creada exitosamente',
    VALIDATION_ERROR: 'Error en los datos de la incidencia',
    UNAUTHORIZED: 'No autorizado para crear incidencias',
    SIMILAR_EXISTS: 'Ya existe una incidencia similar pendiente',
    LIMIT_REACHED: 'Has alcanzado el límite de incidencias activas'
  },

  FETCH: {
    SUCCESS: 'Incidentes obtenidos exitosamente',
    NOT_FOUND: 'Incidencia no encontrada'
  },
  
  UPDATE: {
    SUCCESS: 'Incidencia actualizada exitosamente',
    NOT_FOUND: 'Incidencia no encontrada',
    INVALID_STATUS: 'Estado de incidencia no válido',
    UNAUTHORIZED: 'No autorizado para actualizar esta incidencia'
  },
  
  DELETE: {
    SUCCESS: 'Incidencia eliminada exitosamente',
    NOT_FOUND: 'Incidencia no encontrada',
    UNAUTHORIZED: 'No autorizado para eliminar esta incidencia'
  },
  
  ASSIGNMENT: {
    SUCCESS: 'Incidencia asignada exitosamente',
    ALREADY_ASSIGNED: 'La incidencia ya está asignada',
    INVALID_TECHNICIAN: 'Técnico no válido o no disponible',
    TECHNICIAN_NOT_FOUND: 'Técnico no encontrado',
    SAME_TECHNICIAN: 'La incidencia ya está asignada al mismo técnico'
  },
  
  COMMENTS: {
    ADD_SUCCESS: 'Comentario agregado exitosamente',
    UPDATE_SUCCESS: 'Comentario actualizado exitosamente',
    DELETE_SUCCESS: 'Comentario eliminado exitosamente',
    NOT_FOUND: 'Comentario no encontrado',
    UNAUTHORIZED: 'No autorizado para gestionar este comentario',
    UNAUTHORIZED_DELETE: 'No tienes permisos para eliminar este comentario',
    UNAUTHORIZED_UPDATE: 'No tienes permisos para actualizar este comentario',
    ALREADY_DELETED: 'El comentario ya ha sido eliminado'
  },
  
  TIME_TRACKING: {
    STARTED: 'Incidencia iniciada exitosamente',
    PAUSED: 'Incidencia pausada exitosamente',
    NOT_ASSIGNED: 'No tienes permisos para iniciar esta incidencia',
    ALREADY_STARTED: 'La incidencia ya está en progreso',
    NOT_STARTED: 'La incidencia no ha sido iniciada'
  },

  ATTACHMENTS: {
    UPLOAD_SUCCESS: 'Archivo adjunto subido exitosamente',
    DELETE_SUCCESS: 'Archivo adjunto eliminado exitosamente',
    NOT_FOUND: 'Archivo adjunto no encontrado',
    UNAUTHORIZED_DELETE: 'No tienes permisos para eliminar este archivo adjunto',
    UNAUTHORIZED_UPDATE: 'No tienes permisos para actualizar este archivo adjunto',
    NO_FILE: 'No se ha proporcionado un archivo para subir',
    INVALID_FILE: 'Tipo de archivo no permitido',
    FILE_TOO_LARGE: 'El archivo excede el tamaño máximo permitido',
    NO_FILES: 'No se han proporcionado archivos para subir',
    DELETE_ERROR: 'Error al eliminar el archivo adjunto',
    UPDATE_SUCCESS: 'Archivo adjunto actualizado exitosamente',
  },
  
  STATUS: {
    UPDATED: 'Estado de la incidencia actualizado exitosamente',
    INVALID_TRANSITION: 'Transición de estado no válida',
    UNRESOLVED_DEPENDENCIES: 'No se puede resolver/cerrar esta incidencia porque tiene dependencias sin resolver',
    PROPAGATION_SUCCESS: 'Estado propagado a incidencias dependientes',
    PROPAGATION_PARTIAL: 'Estado actualizado, pero algunas dependencias no pudieron ser actualizadas'
  },
  
  VALIDATION: {
    INVALID_PRIORITY: 'Prioridad no válida',
    INVALID_CATEGORY: 'Categoría no válida',
    INVALID_STATUS: 'Estado no válido',
    REQUIRED_FIELDS: 'Faltan campos requeridos',
    SIMILAR_TITLE: 'Ya existe una incidencia con un título similar',
    ACTIVE_LIMIT: 'Límite de incidencias activas alcanzado'
  },
  
  LIMITS: {
    MAX_ACTIVE_INCIDENTS: 5,
    MAX_ACTIVE_MESSAGE: 'No puedes tener más de 5 incidencias activas simultáneamente'
  },
  
  RELATIONSHIPS: {
    LINK_SUCCESS: 'Incidencias vinculadas exitosamente',
    PARENT_NOT_FOUND: 'La incidencia padre no existe',
    CHILD_NOT_FOUND: 'La incidencia hijo no existe',
    SELF_REFERENCE: 'No es posible vincular una incidencia consigo misma',
    ALREADY_HAS_PARENT: 'Esta incidencia ya está vinculada a otro caso',
    CLOSED_PARENT: 'No es posible vincular incidencias a casos que ya están resueltos o cerrados',
    INVERSE_RELATION: 'No es posible vincular estas incidencias porque ya existe una relación inversa entre ellas',
    UNLINK_SUCCESS: 'Incidencias desvinculadas exitosamente',
    NOT_RELATED: 'Las incidencias no están relacionadas entre sí',
    UNAUTHORIZED: 'No tienes permisos para gestionar las relaciones de esta incidencia. Solo el creador o el técnico asignado pueden realizar esta acción',
    FETCH_SUCCESS: 'Relaciones de la incidencia obtenidas exitosamente',
    INCIDENT_NOT_FOUND: 'No se encontró la incidencia especificada',
    UPDATE_SUCCESS: 'Tipo de relación actualizado exitosamente',
    INVALID_TYPE: 'El tipo de relación debe ser "dependencia" o "relación"'
  }
}; 
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
export const PERMISSION_CATEGORIES = {
  INCIDENT: 'incident',
  COMMENT: 'comment',
  ATTACHMENT: 'attachment',
  USER: 'user',
  REPORT: 'report'
};

export const PERMISSION_ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
  ASSIGN: 'assign',
  RESOLVE: 'resolve'
};

export const PERMISSIONS = {
  // Incidentes
  INCIDENT_CREATE: { name: 'incident:create', category: PERMISSION_CATEGORIES.INCIDENT, action: PERMISSION_ACTIONS.CREATE },
  INCIDENT_READ: { name: 'incident:read', category: PERMISSION_CATEGORIES.INCIDENT, action: PERMISSION_ACTIONS.READ },
  INCIDENT_UPDATE: { name: 'incident:update', category: PERMISSION_CATEGORIES.INCIDENT, action: PERMISSION_ACTIONS.UPDATE },
  INCIDENT_DELETE: { name: 'incident:delete', category: PERMISSION_CATEGORIES.INCIDENT, action: PERMISSION_ACTIONS.DELETE },
  INCIDENT_ASSIGN: { name: 'incident:assign', category: PERMISSION_CATEGORIES.INCIDENT, action: PERMISSION_ACTIONS.ASSIGN },
  INCIDENT_RESOLVE: { name: 'incident:resolve', category: PERMISSION_CATEGORIES.INCIDENT, action: PERMISSION_ACTIONS.RESOLVE },
  
  // ... otros permisos
};

export const ROLES = {
  ADMIN: {
    name: 'admin',
    description: 'Administrador del sistema',
    permissions: Object.values(PERMISSIONS).map(p => p.name)
  },
  SOPORTE: {
    name: 'soporte',
    description: 'Técnico de soporte',
    permissions: [
      PERMISSIONS.INCIDENT_READ.name,
      PERMISSIONS.INCIDENT_UPDATE.name,
      PERMISSIONS.INCIDENT_RESOLVE.name,
      // ... otros permisos
    ]
  },
  USUARIO: {
    name: 'usuario',
    description: 'Usuario regular',
    permissions: [
      PERMISSIONS.INCIDENT_CREATE.name,
      PERMISSIONS.INCIDENT_READ.name
    ]
  }
}; 
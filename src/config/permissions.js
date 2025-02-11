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
  RESOLVE: 'resolve',
  START: 'start'
};

export const PERMISSIONS = {
  // Incidentes
  INCIDENT_CREATE: { name: 'incident:create', category: PERMISSION_CATEGORIES.INCIDENT, action: PERMISSION_ACTIONS.CREATE },
  INCIDENT_READ: { name: 'incident:read', category: PERMISSION_CATEGORIES.INCIDENT, action: PERMISSION_ACTIONS.READ },
  INCIDENT_UPDATE: { name: 'incident:update', category: PERMISSION_CATEGORIES.INCIDENT, action: PERMISSION_ACTIONS.UPDATE },
  INCIDENT_DELETE: { name: 'incident:delete', category: PERMISSION_CATEGORIES.INCIDENT, action: PERMISSION_ACTIONS.DELETE },
  INCIDENT_ASSIGN: { name: 'incident:assign', category: PERMISSION_CATEGORIES.INCIDENT, action: PERMISSION_ACTIONS.ASSIGN },
  INCIDENT_RESOLVE: { name: 'incident:resolve', category: PERMISSION_CATEGORIES.INCIDENT, action: PERMISSION_ACTIONS.RESOLVE },
  INCIDENT_START: { name: 'incident:start', category: PERMISSION_CATEGORIES.INCIDENT, action: PERMISSION_ACTIONS.START },
  
  // Nuevos permisos ABAC
  COMMENT_DELETE: { name: 'comment:delete', category: PERMISSION_CATEGORIES.COMMENT, action: PERMISSION_ACTIONS.DELETE },
  COMMENT_UPDATE: { name: 'comment:update', category: PERMISSION_CATEGORIES.COMMENT, action: PERMISSION_ACTIONS.UPDATE },
  ATTACHMENT_DELETE: { name: 'attachment:delete', category: PERMISSION_CATEGORIES.ATTACHMENT, action: PERMISSION_ACTIONS.DELETE },
  ATTACHMENT_UPDATE: { name: 'attachment:update', category: PERMISSION_CATEGORIES.ATTACHMENT, action: PERMISSION_ACTIONS.UPDATE },
  RELATIONSHIP_MANAGE: { name: 'relationship:manage', category: PERMISSION_CATEGORIES.INCIDENT, action: PERMISSION_ACTIONS.MANAGE }
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
      PERMISSIONS.INCIDENT_START.name,
      PERMISSIONS.COMMENT_UPDATE.name,
      PERMISSIONS.COMMENT_DELETE.name,
      PERMISSIONS.ATTACHMENT_UPDATE.name,
      PERMISSIONS.ATTACHMENT_DELETE.name,
      PERMISSIONS.RELATIONSHIP_MANAGE.name
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
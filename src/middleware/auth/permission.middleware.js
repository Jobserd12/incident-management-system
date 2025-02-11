import boom from '@hapi/boom';
import { UserRepository } from '../../repositories/user.repository.js';
import { IncidentRepository } from '../../repositories/incident.repository.js';
import { PERMISSIONS } from '../../config/permissions.js';

const actionToPermissionMap = {
  createIncident: PERMISSIONS.INCIDENT_CREATE.name,
  readIncident: PERMISSIONS.INCIDENT_READ.name,
  updateIncident: PERMISSIONS.INCIDENT_UPDATE.name,
  deleteIncident: PERMISSIONS.INCIDENT_DELETE.name,
  assignIncident: PERMISSIONS.INCIDENT_ASSIGN.name,
  resolveIncident: PERMISSIONS.INCIDENT_RESOLVE.name,
  commentUpdate: PERMISSIONS.COMMENT_UPDATE.name,
  commentDelete: PERMISSIONS.COMMENT_DELETE.name,
  attachmentUpdate: PERMISSIONS.ATTACHMENT_UPDATE.name,
  attachmentDelete: PERMISSIONS.ATTACHMENT_DELETE.name,
  relationshipManage: PERMISSIONS.RELATIONSHIP_MANAGE.name,
};

export const checkActionPermission = (action) => async (req, res, next) => {
  try {
    const user = await UserRepository.findById(req.user.id)
      .populate('customPermissions.permission');

    const resourceId = req.params.incidentId; // Suponiendo que el ID del recurso está en los parámetros
    const resource = await IncidentRepository.findById(resourceId);

    if (!resource) {
      throw boom.notFound('Incidente no encontrado');
    }

    const requiredPermission = actionToPermissionMap[action];
    const hasPermission = await user.hasPermission(requiredPermission, resource);
    
    if (!hasPermission) {
      throw boom.forbidden('No tienes permisos para realizar esta acción');
    }

    req.resource = resource; // Guardamos el recurso en la solicitud para su uso posterior
    next();
  } catch (error) {
    next(error);
  }
};

export const validateIncidentAccess = async (req, res, next) => {
  try {
    const { incidentId } = req.params;
    const userId = req.user.id;
    
    const [user, incident] = await Promise.all([
      UserRepository.findById(userId).populate('role'),
      IncidentRepository.findById(incidentId)
    ]);

    if (!incident) {
      throw boom.notFound('Incidente no encontrado');
    }

    const isAdmin = user.role.name === 'admin';
    const isCreator = incident.reportedBy.toString() === userId;
    const isAssigned = incident.assignedTo?.toString() === userId;

    if (isAdmin || isCreator || isAssigned) {
      req.incident = incident;
      req.canManage = true;
      return next();
    }

    // Verificar permisos específicos
    const hasPermission = await user.hasPermission('incident:read');
    if (hasPermission) {
      req.incident = incident;
      req.canManage = false;
      return next();
    }

    throw boom.forbidden('No tienes acceso a esta incidencia');
  } catch (error) {
    next(error);
  }
};

// Middleware específico para acciones de gestión
export const canManageIncident = async (req, res, next) => {
  if (!req.canManage) {
    throw boom.forbidden('No tienes permisos para gestionar esta incidencia');
  }
  next();
};
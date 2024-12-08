import boom from '@hapi/boom';
import { UserRepository } from '../../repositories/user.repository.js';
import { IncidentRepository } from '../../repositories/incident.repository.js';

export const checkPermission = (requiredPermission) => async (req, res, next) => {
  try {
    const user = await UserRepository.findById(req.user.id)
      .populate({
        path: 'role',
        populate: { path: 'permissions' }
      })
      .populate('customPermissions.permission');

    const hasPermission = await user.hasPermission(requiredPermission);
    if (!hasPermission) {
      throw boom.forbidden('No tienes permisos para realizar esta acción');
    }

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
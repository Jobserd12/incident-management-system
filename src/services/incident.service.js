import Boom from '@hapi/boom';
import { INCIDENT_MESSAGES } from '../api/constants/messages.js';
import { paginateResults } from '../utils/pagination.helper.js';
import { cacheHelper } from '../utils/cache.helper.js';

export class IncidentService {
  constructor(incidentRepository, userRepository) {
    this.incidentRepository = incidentRepository;
    this.userRepository = userRepository;
  }

  async createIncident(incidentData) {
    const existingSimilar = await this.incidentRepository.findSimilarPending(
      incidentData.reportedBy,
      incidentData.title
    );

    if (existingSimilar) {
      throw Boom.conflict(INCIDENT_MESSAGES.CREATE.SIMILAR_EXISTS, 
        { existingIncidentId: existingSimilar._id }
      );
    }

    const userActiveIncidents = await this.incidentRepository.countActiveByUser(
      incidentData.reportedBy
    );

    if (userActiveIncidents >= INCIDENT_MESSAGES.LIMITS.MAX_ACTIVE_INCIDENTS) {
      throw Boom.tooManyRequests(INCIDENT_MESSAGES.CREATE.LIMIT_REACHED, { 
        currentActive: userActiveIncidents, 
        limit: INCIDENT_MESSAGES.LIMITS.MAX_ACTIVE_INCIDENTS 
      });
    }

    const result = await this.incidentRepository.create(incidentData);
    cacheHelper.invalidate('incidents:');
    return result;
  }

  async assignIncident(incidentId, technicianId, userId, reason = '') {
    const incident = await this.incidentRepository.findById(incidentId);
    if (!incident) {
      throw Boom.notFound(INCIDENT_MESSAGES.UPDATE.NOT_FOUND);
    }

    if (incident.assignedTo) {
      throw Boom.conflict(INCIDENT_MESSAGES.ASSIGNMENT.ALREADY_ASSIGNED);
    }

    const technician = await this.userRepository.findById(technicianId);
    if (!technician) {
      throw Boom.notFound(INCIDENT_MESSAGES.ASSIGNMENT.TECHNICIAN_NOT_FOUND);
    }

    if (incident.status === 'resuelto') {
      throw Boom.badRequest(INCIDENT_MESSAGES.STATUS.INVALID_TRANSITION);
    }

    const assignmentData = {
      assignedTo: technicianId,
      status: 'en_progreso',
      $push: {
        assignmentHistory: {
          assignedTo: technicianId,
          assignedBy: userId,
          reason: reason
        }
      }
    };

    return this.incidentRepository.assignTo(incidentId, assignmentData);
  }

  async updateStatus(incidentId, { status, resolution }) {
    const incident = await this.incidentRepository.findByIdDetailed(incidentId);
    if (!incident) {
      throw Boom.notFound(INCIDENT_MESSAGES.UPDATE.NOT_FOUND);
    }

    const validTransitions = {
      'nuevo': ['en_progreso', 'rechazado'],
      'en_progreso': ['resuelto', 'rechazado'],
      'resuelto': ['cerrado'],
      'cerrado': [],
      'rechazado': []
    };

    if (!validTransitions[incident.status].includes(status)) {
      throw Boom.badRequest(INCIDENT_MESSAGES.STATUS.INVALID_TRANSITION);
    }

    if (['resuelto', 'cerrado'].includes(status)) {
      const hasUnresolvedDependencies = incident.childIncidents.some(child => 
        child.relationType === 'dependencia' && 
        !['resuelto', 'cerrado'].includes(child.incident.status)
      );

      if (hasUnresolvedDependencies) {
        throw Boom.preconditionFailed(INCIDENT_MESSAGES.STATUS.UNRESOLVED_DEPENDENCIES);
      }
    }

    // Propagar estado a incidencias dependientes
    let updatedIncidents = [await this.incidentRepository.updateStatus(incidentId, { status, resolution })];

    // Si se rechaza o resuelve, propagar a incidencias dependientes
    if (['rechazado', 'resuelto'].includes(status)) {
      const dependentIncidents = incident.childIncidents
        .filter(child => child.relationType === 'dependencia')
        .map(child => child.incident._id);

      if (dependentIncidents.length > 0) {
        const propagatedUpdates = await Promise.all(
          dependentIncidents.map(childId => 
            this.incidentRepository.updateStatus(childId, { 
              status,
              resolution: `Estado propagado desde incidencia padre ${incident.ticketNumber}`
            })
          )
        );
        updatedIncidents = [...updatedIncidents, ...propagatedUpdates];
      }
    }

    cacheHelper.invalidate('incidents:');
    return updatedIncidents[0]; 
  }

  async getIncidents(filters) {
    try {
      const cacheKey = `incidents:${JSON.stringify(filters)}`;
      
      return await cacheHelper.getOrSet(
        cacheKey,
        async () => {
          const { items, total } = await this.incidentRepository.findByFilters(filters);
          
          const page = parseInt(filters.page);
          const limit = parseInt(filters.limit);
          const totalPages = Math.ceil(total / limit);

          return {
            items,
            metadata: {
              total,
              currentPage: page,
              totalPages,
              itemsPerPage: limit,
              hasNextPage: page < totalPages,
              hasPrevPage: page > 1
            }
          };
        },
        300 
      );
    } catch (error) {
      throw Boom.badImplementation('Error al obtener incidentes', error);
    }
  }

  async updateIncident(incidentId, updateData, userId) {
    const incident = await this.incidentRepository.findById(incidentId);
    if (!incident) {
      throw Boom.notFound(INCIDENT_MESSAGES.UPDATE.NOT_FOUND);
    }

    if (updateData.status) {
      const validTransitions = {
        'nuevo': ['en_progreso', 'rechazado'],
        'en_progreso': ['resuelto', 'rechazado'],
        'resuelto': ['cerrado'],
        'cerrado': [],
        'rechazado': []
      };

      if (!validTransitions[incident.status].includes(updateData.status)) {
        throw Boom.badRequest(INCIDENT_MESSAGES.STATUS.INVALID_TRANSITION);
      }
    }

    // Preparar datos para el historial
    const changes = [];
    Object.keys(updateData).forEach(field => {
      if (incident[field] !== updateData[field]) {
        changes.push({
          field,
          oldValue: incident[field],
          newValue: updateData[field],
          changedBy: userId,
          changedAt: new Date()
        });
      }
    });

    // Actualizar timeTracking si cambia el estado
    if (updateData.status) {
      switch (updateData.status) {
        case 'en_progreso':
          if (!incident.timeTracking.started) {
            updateData['timeTracking.started'] = new Date();
          }
          updateData['timeTracking.paused'] = null;
          break;
        case 'resuelto':
        case 'cerrado':
        case 'rechazado':
          if (incident.timeTracking.started && !incident.timeTracking.paused) {
            const timeSpent = new Date() - new Date(incident.timeTracking.started);
            updateData['timeTracking.spent'] = timeSpent;
            updateData['timeTracking.paused'] = new Date();
          }
          break;
      }
    }

    // Agregar los cambios al historial y actualizar
    updateData.changeHistory = [...(incident.changeHistory || []), ...changes];

    const updatedIncident = await this.incidentRepository.update(incidentId, updateData);
    cacheHelper.invalidate('incidents:');
    
    return updatedIncident;
  }

  async reassignIncident(incidentId, newTechnicianId, userId, reason) {
    const incident = await this.incidentRepository.findById(incidentId);
    if (!incident) {
      throw Boom.notFound(INCIDENT_MESSAGES.UPDATE.NOT_FOUND);
    }
    if (incident.assignedTo?._id.toString() === newTechnicianId) {
      throw Boom.badRequest(INCIDENT_MESSAGES.ASSIGNMENT.SAME_TECHNICIAN);
    }

    const technician = await this.userRepository.findById(newTechnicianId);
    if (!technician) {
      throw Boom.notFound(INCIDENT_MESSAGES.ASSIGNMENT.TECHNICIAN_NOT_FOUND);
    }

    const reassignmentData = {
      assignedTo: newTechnicianId,
      $push: {
        assignmentHistory: {
          assignedTo: newTechnicianId,
          assignedBy: userId,
          reason: reason
        }
      }
    };

    return this.incidentRepository.assignTo(incidentId, reassignmentData);
  }

  async getIncidentsByTechnician(technicianId, filters = {}) {
    const technician = await this.userRepository.findById(technicianId);
    if (!technician) {
      throw Boom.notFound(INCIDENT_MESSAGES.ASSIGNMENT.TECHNICIAN_NOT_FOUND);
    }

    const cleanFilters = Object.entries(filters)
      .reduce((acc, [key, value]) => {
        if (value) {
          acc[key] = value;
        }
        return acc;
      }, {});

    return this.incidentRepository.findByTechnician(technicianId, cleanFilters);
  }

  async getTechnicianWorkload(technicianId) {
    const technician = await this.userRepository.findById(technicianId);
    if (!technician) {
      throw Boom.notFound(INCIDENT_MESSAGES.ASSIGNMENT.TECHNICIAN_NOT_FOUND);
    }

    return this.incidentRepository.getTechnicianWorkload(technicianId);
  }

  async getIncidentById(incidentId) {
    const incident = await this.incidentRepository.findByIdDetailed(incidentId);
    
    if (!incident) {
      throw Boom.notFound(INCIDENT_MESSAGES.FETCH.NOT_FOUND);
    }

    return incident;
  }

  async linkIncidents(parentId, childId, type = 'relación', userId) {
    const [parent, child] = await Promise.all([
      this.incidentRepository.findById(parentId),
      this.incidentRepository.findById(childId)
    ]);

    if (!parent) {
      throw Boom.notFound(INCIDENT_MESSAGES.RELATIONSHIPS.PARENT_NOT_FOUND);
    }
    if (!child) {
      throw Boom.notFound(INCIDENT_MESSAGES.RELATIONSHIPS.CHILD_NOT_FOUND);
    }
    if (parent._id.toString() === childId) {
      throw Boom.badRequest(INCIDENT_MESSAGES.RELATIONSHIPS.SELF_REFERENCE);
    }

    if (child.parentIncident) {
      throw Boom.conflict(INCIDENT_MESSAGES.RELATIONSHIPS.ALREADY_HAS_PARENT);
    }

    const isChildParent = parent.parentIncident && 
                         parent.parentIncident.toString() === childId;
    if (isChildParent) {
      throw Boom.badRequest(INCIDENT_MESSAGES.RELATIONSHIPS.INVERSE_RELATION);
    }

    if (['resuelto', 'cerrado'].includes(parent.status)) {
      throw Boom.badRequest(INCIDENT_MESSAGES.RELATIONSHIPS.CLOSED_PARENT);
    }

    const canManageRelation = 
      parent.reportedBy._id.toString() === userId ||
      (parent.assignedTo && parent.assignedTo._id.toString() === userId);

    if (!canManageRelation) {
      throw Boom.forbidden(INCIDENT_MESSAGES.RELATIONSHIPS.UNAUTHORIZED);
    }

    return this.incidentRepository.linkIncidents(parentId, childId, type);
  }

  async unlinkIncidents(parentId, childId, userId) {
    const [parent, child] = await Promise.all([
      this.incidentRepository.findById(parentId),
      this.incidentRepository.findById(childId)
    ]);

    if (!parent) {
      throw Boom.notFound(INCIDENT_MESSAGES.RELATIONSHIPS.PARENT_NOT_FOUND);
    }
    if (!child) {
      throw Boom.notFound(INCIDENT_MESSAGES.RELATIONSHIPS.CHILD_NOT_FOUND);
    }

    const relationExists = parent.childIncidents.some(
      relation => relation.incident.toString() === childId
    );
    if (!relationExists) {
      throw Boom.notFound(INCIDENT_MESSAGES.RELATIONSHIPS.NOT_RELATED);
    }

    const canManageRelation = 
      parent.reportedBy._id.toString() === userId ||
      (parent.assignedTo && parent.assignedTo._id.toString() === userId);

    if (!canManageRelation) {
      throw Boom.forbidden(INCIDENT_MESSAGES.RELATIONSHIPS.UNAUTHORIZED);
    }

    return this.incidentRepository.unlinkIncidents(parentId, childId);
  }

  async getIncidentRelationships(incidentId) {
    const incident = await this.incidentRepository.findById(incidentId);
    
    if (!incident) {
      throw Boom.notFound(INCIDENT_MESSAGES.RELATIONSHIPS.INCIDENT_NOT_FOUND);
    }

    return this.incidentRepository.getRelationships(incidentId);
  }

  async updateRelationType(parentId, childId, type, userId) {
    const [parent, child] = await Promise.all([
      this.incidentRepository.findById(parentId),
      this.incidentRepository.findById(childId)
    ]);

    if (!parent) {
      throw Boom.notFound(INCIDENT_MESSAGES.RELATIONSHIPS.PARENT_NOT_FOUND);
    }
    if (!child) {
      throw Boom.notFound(INCIDENT_MESSAGES.RELATIONSHIPS.CHILD_NOT_FOUND);
    }

    const relationship = parent.childIncidents.find(
      rel => rel.incident.toString() === childId
    );
    if (!relationship) {
      throw Boom.notFound(INCIDENT_MESSAGES.RELATIONSHIPS.NOT_RELATED);
    }

    const canManageRelation = 
      parent.reportedBy._id.toString() === userId ||
      (parent.assignedTo && parent.assignedTo._id.toString() === userId);

    if (!canManageRelation) {
      throw Boom.forbidden(INCIDENT_MESSAGES.RELATIONSHIPS.UNAUTHORIZED);
    }

    return this.incidentRepository.updateRelationType(parentId, childId, type);
  }
} 
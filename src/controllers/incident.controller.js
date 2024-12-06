import { INCIDENT_MESSAGES } from '../api/constants/messages.js';

export class IncidentController {
  constructor(incidentService) {
    this.incidentService = incidentService;
  }

  createIncident = async (req, res, next) => {
    try {
      const reportedBy = req.user.id;
      const incidentData = { ...req.body, reportedBy };

      const result = await this.incidentService.createIncident(incidentData);
      
      res.status(201).json({
        status: 'success',
        message: INCIDENT_MESSAGES.CREATE.SUCCESS,
        data: { incident: result }
      });
    } catch (error) {
      next(error);
    }
  }

  assignIncident = async (req, res, next) => {
    try {
      const { incidentId } = req.params;
      const { technicianId, reason } = req.body;
      const userId = req.user.id;

      const incident = await this.incidentService.assignIncident(
        incidentId, 
        technicianId, 
        userId,
        reason
      );
      
      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.ASSIGNMENT.SUCCESS,
        data: { incident }
      });
    } catch (error) {
      next(error);
    }
  }

  updateIncidentStatus = async (req, res, next) => {
    try {
      const { incidentId } = req.params;
      const { status, resolution } = req.body;

      const incident = await this.incidentService.updateStatus(
        incidentId, 
        { status, resolution }
      );
      
      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.STATUS.UPDATED,
        data: { incident }
      });
    } catch (error) {
      next(error);
    }
  }

  getIncidents = async (req, res, next) => {
    try {
      const filters = {
        status: req.query.status,
        priority: req.query.priority,
        category: req.query.category,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc'  
      };

      const result = await this.incidentService.getIncidents(filters);
      
      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.FETCH.SUCCESS,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  updateIncident = async (req, res, next) => {
    try {
      const { incidentId } = req.params;
      const updateData = req.body;
      const userId = req.user._id;

      const updatedIncident = await this.incidentService.updateIncident(
        incidentId, 
        updateData,
        userId
      );
      
      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.UPDATE.SUCCESS,
        data: { incident: updatedIncident }
      });
    } catch (error) {
      next(error);
    }
  }

  reassignIncident = async (req, res, next) => {
    try {
      const { incidentId } = req.params;
      const { technicianId, reason } = req.body;
      const userId = req.user.id;

      const incident = await this.incidentService.reassignIncident(
        incidentId,
        technicianId,
        userId,
        reason
      );

      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.ASSIGNMENT.REASSIGNED,
        data: { incident }
      });
    } catch (error) {
      next(error);
    }
  }

  getTechnicianIncidents = async (req, res, next) => {
    try {
      const { technicianId } = req.params;
      const filters = {
        status: req.query.status,
        priority: req.query.priority
      };

      const incidents = await this.incidentService.getIncidentsByTechnician(
        technicianId,
        filters
      );

      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.FETCH.SUCCESS,
        data: { incidents }
      });
    } catch (error) {
      next(error);
    }
  }

  getTechnicianWorkload = async (req, res, next) => {
    try {
      const { technicianId } = req.params;
      const workload = await this.incidentService.getTechnicianWorkload(technicianId);

      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.FETCH.SUCCESS,
        data: { workload }
      });
    } catch (error) {
      next(error);
    }
  }

  getIncident = async (req, res, next) => {
    try {
      const { incidentId } = req.params;
      
      const incident = await this.incidentService.getIncidentById(incidentId);
      
      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.FETCH.SUCCESS,
        data: { incident }
      });
    } catch (error) {
      next(error);
    }
  }

  linkIncidents = async (req, res, next) => {
    try {
      const { incidentId } = req.params;
      const { childId, type } = req.body;
      const userId = req.user.id;
      
      const result = await this.incidentService.linkIncidents(incidentId, childId, type, userId);
      
      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.RELATIONSHIPS.LINK_SUCCESS,
        data: { incident: result }
      });
    } catch (error) {
      next(error);
    }
  }

  unlinkIncidents = async (req, res, next) => {
    try {
      const { incidentId, childId } = req.params;
      const userId = req.user.id;
      
      const result = await this.incidentService.unlinkIncidents(incidentId, childId, userId);
      
      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.RELATIONSHIPS.UNLINK_SUCCESS,
        data: { incident: result }
      });
    } catch (error) {
      next(error);
    }
  }

  getIncidentRelationships = async (req, res, next) => {
    try {
      const { incidentId } = req.params;
      
      const relationships = await this.incidentService.getIncidentRelationships(incidentId);
      
      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.RELATIONSHIPS.FETCH_SUCCESS,
        data: { relationships }
      });
    } catch (error) {
      next(error);
    }
  }

  updateRelationType = async (req, res, next) => {
    try {
      const { incidentId, childId } = req.params;
      const { type } = req.body;
      const userId = req.user.id;
      
      const result = await this.incidentService.updateRelationType(
        incidentId, 
        childId, 
        type,
        userId
      );
      
      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.RELATIONSHIPS.UPDATE_SUCCESS,
        data: { incident: result }
      });
    } catch (error) {
      next(error);
    }
  }

}


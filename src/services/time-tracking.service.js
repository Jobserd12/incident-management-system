import Boom from '@hapi/boom';
import { INCIDENT_MESSAGES } from '../api/constants/messages.js';

export class TimeTrackingService {
  constructor(timeTrackingRepository) {
    this.timeTrackingRepository = timeTrackingRepository;
  }

  async startWork(incidentId, userId, estimated) {
    const incident = await this.timeTrackingRepository.findById(incidentId);
    if (!incident) {
      throw Boom.notFound(INCIDENT_MESSAGES.UPDATE.NOT_FOUND);
    }

    if (!estimated) {
      const defaultTimes = {
        'crítica': 2,
        'alta': 4,
        'media': 8,
        'baja': 16
      };
      estimated = defaultTimes[incident.priority];
    }

    if (!incident.assignedTo || incident.assignedTo._id.toString() !== userId.toString()) {
      throw Boom.forbidden(INCIDENT_MESSAGES.TIME_TRACKING.NOT_ASSIGNED);
    }

    if (incident.timeTracking.started && !incident.timeTracking.paused) {
      throw Boom.badRequest(INCIDENT_MESSAGES.TIME_TRACKING.ALREADY_STARTED);
    }

    return this.timeTrackingRepository.startWork(incidentId, estimated);
  }

  async pauseWork(incidentId, userId) {
    const incident = await this.timeTrackingRepository.findById(incidentId);
    if (!incident) {
      throw Boom.notFound(INCIDENT_MESSAGES.UPDATE.NOT_FOUND);
    }

    if (!incident.assignedTo || incident.assignedTo._id.toString() !== userId.toString()) {
      throw Boom.forbidden(INCIDENT_MESSAGES.TIME_TRACKING.NOT_ASSIGNED);
    }

    if (!incident.timeTracking.started || incident.timeTracking.paused) {
      throw Boom.badRequest(INCIDENT_MESSAGES.TIME_TRACKING.NOT_STARTED);
    }

    return this.timeTrackingRepository.pauseWork(incidentId);
  }

  async getTimeMetrics() {
    const metrics = await this.timeTrackingRepository.getTimeMetrics();
    
    const [results] = metrics;
    
    return {
      byCategory: results.byCategory.map(cat => ({
        category: cat._id,
        averageTime: this.formatTime(cat.avgTime),
        totalIncidents: cat.totalIncidents
      })),
      
      byPriority: results.byPriority.map(pri => ({
        priority: pri._id,
        averageTime: this.formatTime(pri.avgTime),
        totalIncidents: pri.totalIncidents
      })),
      
      estimatedVsActual: results.estimatedVsActual.map(metric => ({
        averageEstimatedTime: this.formatTime(metric.avgEstimated),
        averageActualTime: this.formatTime(metric.avgActual),
        totalIncidents: metric.totalIncidents,
        accurateEstimatesPercentage: Math.round(metric.accurateEstimatesPercentage)
      }))[0] || null
    };
  }

  formatTime(milliseconds) {
    if (!milliseconds) return '0m';
    
    const minutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  }
} 
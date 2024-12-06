import { INCIDENT_MESSAGES } from '../api/constants/messages.js';
    
export class TimeTrackingController {
  constructor(timeTrackingService) {
    this.timeTrackingService = timeTrackingService;
  }

  startWork = async (req, res, next) => {
    try {
      const { incidentId } = req.params;
      const { estimated } = req.body;
      const userId = req.user._id;

      const incident = await this.timeTrackingService.startWork(incidentId, userId, estimated);
      
      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.TIME_TRACKING.STARTED,
        data: { incident }
      });
    } catch (error) {
      next(error);
    }
  }

  pauseWork = async (req, res, next) => {
    try {
      const { incidentId } = req.params;
      const userId = req.user._id;

      const incident = await this.timeTrackingService.pauseWork(incidentId, userId);
      
      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.TIME_TRACKING.PAUSED,
        data: { incident }
      });
    } catch (error) {
      next(error);
    }
  }

  getTimeMetrics = async (req, res, next) => {
    try {
      const metrics = await this.timeTrackingService.getTimeMetrics();
      
      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.TIME_TRACKING.METRICS_FETCHED,
        data: { metrics }
      });
    } catch (error) {
      next(error);
    }
  }
}

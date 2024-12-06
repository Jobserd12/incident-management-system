import { IncidentRepository } from './incident.repository.js';
import { CommentRepository } from './comment.repository.js';
import { TimeTrackingRepository } from './time-tracking.repository.js';

const incidentRepository = new IncidentRepository();
const commentRepository = new CommentRepository();
const timeTrackingRepository = new TimeTrackingRepository();

export {
  incidentRepository,
  commentRepository,
  timeTrackingRepository
}; 
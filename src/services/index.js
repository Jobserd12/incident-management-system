import { IncidentService } from './incident.service.js';
import { CommentService } from './comment.service.js';
import { TimeTrackingService } from './time-tracking.service.js';
import { incidentRepository, commentRepository, timeTrackingRepository } from '../repositories/index.js';
import userRepository from '../repositories/user.repository.js';
import { AttachmentService } from './attachment.service.js';

const incidentService = new IncidentService(incidentRepository, userRepository);
const commentService = new CommentService(commentRepository);
const timeTrackingService = new TimeTrackingService(timeTrackingRepository);
const attachmentService = new AttachmentService(incidentRepository);
export {
  incidentService,
  commentService,
  timeTrackingService,
  attachmentService
}; 
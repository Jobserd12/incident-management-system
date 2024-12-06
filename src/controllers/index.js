import { IncidentController } from './incident.controller.js';
import { CommentController } from './comment.controller.js';
import { TimeTrackingController } from './time-tracking.controller.js';
import { incidentService, commentService, timeTrackingService, attachmentService } from '../services/index.js';
import { AdminController } from './admin.controller.js';
import { AttachmentController } from './attachment.controller.js';

const adminController = new AdminController();
const incidentController = new IncidentController(incidentService);
const commentController = new CommentController(commentService);
const timeTrackingController = new TimeTrackingController(timeTrackingService);
const attachmentController = new AttachmentController(attachmentService);


export const {
  cleanupDeletedComments
} = adminController;

export const {
  createIncident,
  assignIncident,
  updateIncidentStatus,
  getIncidents,
  getIncident,
  updateIncident,
  getTechnicianIncidents,
  getTechnicianWorkload,
  reassignIncident,
  linkIncidents,
  unlinkIncidents,
  getIncidentRelationships,
  updateRelationType
} = incidentController;

export const {
  addComment,
  getComments,
  deleteComment,
  updateComment
} = commentController;

export const {
  startWork,
  pauseWork,
  getTimeMetrics
} = timeTrackingController;

export const {
  uploadAttachments,
  deleteAttachment,
  getAttachment,
  listAttachments,
  updateAttachment
} = attachmentController;

export {
  incidentController,
  commentController,
  timeTrackingController,
  adminController,
  attachmentController
}; 
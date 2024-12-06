import { INCIDENT_MESSAGES } from '../api/constants/messages.js';

export class CommentController {
  constructor(commentService) {
    this.commentService = commentService;
  }

  addComment = async (req, res, next) => {
    try {
      const { incidentId } = req.params;
      const { text } = req.body;
      const userId = req.user._id;

      const incident = await this.commentService.addComment(incidentId, text, userId);
      
      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.COMMENTS.ADD_SUCCESS,
        data: { incident }
      });
    } catch (error) {
      next(error);
    }
  }

  getComments = async (req, res, next) => {
    try {
      const { incidentId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const comments = await this.commentService.getComments(incidentId, { page, limit });
      
      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.COMMENTS.GET_SUCCESS,
        data: { comments }
      });
    } catch (error) {
      next(error);
    }
  }

  deleteComment = async (req, res, next) => {
    try {
      const { incidentId, commentId } = req.params;
      const userId = req.user._id;

      await this.commentService.deleteComment(incidentId, commentId, userId);
      
      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.COMMENTS.DELETE_SUCCESS
      });
    } catch (error) {
      next(error);
    }
  }

  updateComment = async (req, res, next) => {
    try {
      const { incidentId, commentId } = req.params;
      const { text } = req.body;
      const userId = req.user._id;

      const updatedIncident = await this.commentService.updateComment(incidentId, commentId, text, userId);
      
      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.COMMENTS.UPDATE_SUCCESS,
        data: { incident: updatedIncident }
      });
    } catch (error) {
      next(error);
    }
  }
} 
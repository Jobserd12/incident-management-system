import Boom from '@hapi/boom';
import { INCIDENT_MESSAGES } from "../api/constants/messages.js";
import { cloudinaryService } from '../config/cloudinary.config.js';

export class AttachmentController {
  constructor(attachmentService) {
    this.attachmentService = attachmentService;
  }

  uploadAttachments = async (req, res, next) => {
    try {
      const { incidentId } = req.params;
      const { description } = req.body;
      const userId = req.user._id;

      if (!req.files?.length) {
        throw Boom.badRequest(INCIDENT_MESSAGES.ATTACHMENTS.NO_FILES);
      }

      const incident = await this.attachmentService.addAttachments(
        incidentId,
        req.files,
        userId,
        description
      );

      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.ATTACHMENTS.UPLOAD_SUCCESS,
        data: { 
          incident,
          attachments: incident.attachments.map(att => ({
            id: att._id,
            url: att.url,
            filename: att.originalName,
            size: att.size
          }))
        }
      });
    } catch (error) {
      if (req.files) {
        for (const file of req.files) {
          try {
            await cloudinaryService.uploader.destroy(file.filename);
          } catch (cleanupError) {
            console.error('Error limpiando archivo:', cleanupError);
          }
        }
      }
      next(error);
    }
  }

  listAttachments = async (req, res, next) => {
    try {
      const { incidentId } = req.params;
      const attachments = await this.attachmentService.listAttachments(incidentId);
      res.json({
        status: 'success',
        data: attachments
      });
    } catch (error) {
      next(error);
    }
  }

  getAttachment = async (req, res, next) => {
    try {
      const { incidentId, attachmentId } = req.params;
      const attachment = await this.attachmentService.getAttachment(incidentId, attachmentId);
      res.json({
        status: 'success',
        data: attachment
      });
    } catch (error) {
      next(error);
    }
  }

  deleteAttachment = async (req, res, next) => {
    try {
      const { incidentId, attachmentId } = req.params;
      const userId = req.user._id;

      await this.attachmentService.deleteAttachment(incidentId, attachmentId, userId);

      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.ATTACHMENTS.DELETE_SUCCESS
      });
    } catch (error) {
      next(error);
    }
  }

  updateAttachment = async (req, res, next) => {
    try {
      const { incidentId, attachmentId } = req.params;
      const { description } = req.body;
      const userId = req.user._id;

      if (!req.file) {
        throw Boom.badRequest(INCIDENT_MESSAGES.ATTACHMENTS.NO_FILE);
      }

      const updatedAttachment = await this.attachmentService.updateAttachment(
        incidentId,
        attachmentId,
        req.file,
        userId,
        description
      );

      res.json({
        status: 'success',
        message: INCIDENT_MESSAGES.ATTACHMENTS.UPDATE_SUCCESS,
        data: updatedAttachment
      });
    } catch (error) {
      if (req.file) {
        try {
          await cloudinaryService.uploader.destroy(req.file.filename);
        } catch (cleanupError) {
          console.error('Error limpiando archivo:', cleanupError);
        }
      }
      next(error);
    }
  }
} 
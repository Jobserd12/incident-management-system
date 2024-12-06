import Boom from '@hapi/boom';
import { INCIDENT_MESSAGES } from '../api/constants/messages.js';
import { cloudinaryService } from '../config/cloudinary.config.js';

export class AttachmentService {
  constructor(incidentRepository) {
    this.incidentRepository = incidentRepository;
  }

  async addAttachments(incidentId, files, userId, description = '') {
    const incident = await this.incidentRepository.findById(incidentId);
    if (!incident) {
      throw Boom.notFound(INCIDENT_MESSAGES.UPDATE.NOT_FOUND);
    }

    const processedFiles = new Set();
    const attachments = [];

    for (const file of files) {
      const fileKey = `${file.originalname}-${file.size}`;
      
      if (!processedFiles.has(fileKey)) {
        processedFiles.add(fileKey);
        
        attachments.push({
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: file.path,
          uploadedBy: userId,
          description,
          uploadedAt: new Date()
        });
      }
    }

    return this.incidentRepository.addAttachments(incidentId, attachments);
  }

  async listAttachments(incidentId) {
    const incident = await this.incidentRepository.findById(incidentId);
    if (!incident) {
      throw Boom.notFound(INCIDENT_MESSAGES.UPDATE.NOT_FOUND);
    }
    return incident.attachments;
  }

  async getAttachment(incidentId, attachmentId) {
    const incident = await this.incidentRepository.findById(incidentId);
    if (!incident) {
      throw Boom.notFound(INCIDENT_MESSAGES.UPDATE.NOT_FOUND);
    }
    const attachment = incident.attachments.id(attachmentId);
    if (!attachment) {
      throw Boom.notFound(INCIDENT_MESSAGES.ATTACHMENTS.NOT_FOUND);
    }
    return attachment;
  }

  async deleteAttachment(incidentId, attachmentId, userId) {
    const incident = await this.incidentRepository.findById(incidentId);
    if (!incident) {
      throw Boom.notFound(INCIDENT_MESSAGES.UPDATE.NOT_FOUND);
    }

    const attachment = incident.attachments?.id(attachmentId);
    if (!attachment) {
      throw Boom.notFound(INCIDENT_MESSAGES.ATTACHMENTS.NOT_FOUND);
    }
    
    if (attachment.uploadedBy.toString() !== userId.toString()) {
      throw Boom.forbidden(INCIDENT_MESSAGES.ATTACHMENTS.UNAUTHORIZED_DELETE);
    }

    try {
      await cloudinaryService.uploader.destroy(attachment.filename);
    } catch (error) {
      throw Boom.badImplementation(INCIDENT_MESSAGES.ATTACHMENTS.DELETE_ERROR);
    }

    return this.incidentRepository.removeAttachment(incidentId, attachmentId);
  }

  async updateAttachment(incidentId, attachmentId, file, userId, description) {
    const incident = await this.incidentRepository.findById(incidentId);
    if (!incident) {
      throw Boom.notFound(INCIDENT_MESSAGES.UPDATE.NOT_FOUND);
    }

    const attachment = incident.attachments.id(attachmentId);
    if (!attachment) {
      throw Boom.notFound(INCIDENT_MESSAGES.ATTACHMENTS.NOT_FOUND);
    }

    if (attachment.uploadedBy.toString() !== userId.toString()) {
      throw Boom.forbidden(INCIDENT_MESSAGES.ATTACHMENTS.UNAUTHORIZED_UPDATE);
    }

    try {
      // Intentar eliminar el archivo anterior de Cloudinary
      try {
        await cloudinaryService.uploader.destroy(attachment.filename);
      } catch (cloudinaryError) {
        // Si el archivo no existe en Cloudinary, solo logueamos el error pero continuamos
        console.warn('Archivo no encontrado en Cloudinary:', attachment.filename);
      }

      // Crear el nuevo attachment con los datos actualizados
      const newAttachment = {
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: file.path,
        uploadedBy: userId,
        description: description || attachment.description,
        uploadedAt: new Date()
      };

      // Actualizar los datos del attachment
      Object.assign(attachment, newAttachment);
      await incident.save();

      return attachment;
    } catch (error) {
      // Si hay un error en el proceso, asegurarnos de limpiar el nuevo archivo
      try {
        await cloudinaryService.uploader.destroy(file.filename);
      } catch (cleanupError) {
        console.error('Error limpiando nuevo archivo:', cleanupError);
      }
      throw error;
    }
  }
}
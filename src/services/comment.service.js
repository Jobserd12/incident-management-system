import Boom from '@hapi/boom';
import { INCIDENT_MESSAGES } from '../api/constants/messages.js';
import { cacheHelper } from '../utils/cache.helper.js';

export class CommentService {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async addComment(incidentId, text, userId) {
    const incident = await this.commentRepository.findById(incidentId);
    if (!incident) {
      throw Boom.notFound(INCIDENT_MESSAGES.UPDATE.NOT_FOUND);
    }

    const result = await this.commentRepository.addComment(incidentId, { text, user: userId });
    cacheHelper.invalidate(`comments:${incidentId}`);
    return result;
  }

  async getComments(incidentId, { page = 1, limit = 10 }) {
    try {
      const cacheKey = `comments:${incidentId}:page${page}:limit${limit}`;
      
      return await cacheHelper.getOrSet(
        cacheKey,
        async () => {
          const { items, total } = await this.commentRepository.getComments(incidentId);
          
          const currentPage = parseInt(page);
          const itemsPerPage = parseInt(limit);
          const totalPages = Math.ceil(total / itemsPerPage);

          const startIndex = (currentPage - 1) * itemsPerPage;
          const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

          return {
            items: paginatedItems,
            metadata: {
              total,
              currentPage,
              totalPages,
              itemsPerPage,
              hasNextPage: currentPage < totalPages,
              hasPrevPage: currentPage > 1
            }
          };
        },
        300 
      );
    } catch (error) {
      throw Boom.badImplementation('Error al obtener comentarios', error);
    }
  }

  async deleteComment(incidentId, commentId, userId) {
    const incident = await this.commentRepository.findById(incidentId);
    if (!incident) {
      throw Boom.notFound(INCIDENT_MESSAGES.UPDATE.NOT_FOUND);
    }

    const comment = incident.comments.id(commentId);
    if (!comment) {
      throw Boom.notFound(INCIDENT_MESSAGES.COMMENTS.NOT_FOUND);
    }

    if (comment.deletedAt) {
      throw Boom.badRequest(INCIDENT_MESSAGES.COMMENTS.ALREADY_DELETED);
    }

    if (comment.user._id.toString() !== userId.toString()) {
      throw Boom.forbidden(INCIDENT_MESSAGES.COMMENTS.UNAUTHORIZED_DELETE);
    }

    await this.commentRepository.deleteComment(incidentId, commentId, userId);
    cacheHelper.invalidate(`comments:${incidentId}`);
  }

  async updateComment(incidentId, commentId, text, userId) {
    const incident = await this.commentRepository.findById(incidentId);
    if (!incident) {
      throw Boom.notFound(INCIDENT_MESSAGES.UPDATE.NOT_FOUND);
    }

    const comment = incident.comments.id(commentId);
    if (!comment) {
      throw Boom.notFound(INCIDENT_MESSAGES.COMMENTS.NOT_FOUND);
    }

    if (comment.user._id.toString() !== userId.toString()) {
      throw Boom.forbidden(INCIDENT_MESSAGES.COMMENTS.UNAUTHORIZED_UPDATE);
    }

    const result = await this.commentRepository.updateComment(incidentId, commentId, text);
    cacheHelper.invalidate(`comments:${incidentId}`);
    return result;
  }

  async restoreComment(incidentId, commentId, userId) {
    const incident = await this.commentRepository.findById(incidentId);
    if (!incident) {
      throw Boom.notFound(INCIDENT_MESSAGES.UPDATE.NOT_FOUND);
    }

    const comment = incident.comments.id(commentId);
    if (!comment) {
      throw Boom.notFound(INCIDENT_MESSAGES.COMMENTS.NOT_FOUND);
    }

    if (comment.deletedAt) {
      throw Boom.badRequest(INCIDENT_MESSAGES.COMMENTS.ALREADY_DELETED);
    }

    if (comment.user._id.toString() !== userId.toString()) {
      throw Boom.forbidden(INCIDENT_MESSAGES.COMMENTS.UNAUTHORIZED_DELETE);
    }

    await this.commentRepository.restoreComment(incidentId, commentId, userId);
    cacheHelper.invalidate(`comments:${incidentId}`);
  }
} 
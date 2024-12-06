import Incident from '../models/incident.model.js';
import { paginateResults } from '../utils/pagination.helper.js';

export class CommentRepository {
  async findById(id) {
    return Incident.findById(id)
      .populate('comments.user', 'username email');
  }

  async getComments(id) {
    const incident = await Incident.findById(id)
      .select('comments')
      .populate({
        path: 'comments.user',
        select: 'username email'
      })
      .lean()
      .exec();

    if (!incident) {
      return { items: [], total: 0 };
    }

    const activeComments = incident.comments
      .filter(comment => !comment.deletedAt)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      items: activeComments,
      total: activeComments.length
    };
  }

  async addComment(id, commentData) {
    return Incident.findByIdAndUpdate(
      id,
      { 
        $push: { comments: commentData },
        updatedAt: new Date()
      },
      { new: true }
    ).populate('reportedBy', 'username email')
     .populate('assignedTo', 'username email')
     .populate('comments.user', 'username email');
  }

  async deleteComment(incidentId, commentId, userId) {
    return Incident.findOneAndUpdate(
      { 
        _id: incidentId,
        'comments._id': commentId 
      },
      { 
        $set: { 
          'comments.$.deletedAt': new Date(),
          'comments.$.deletedBy': userId
        }
      },
      { new: true }
    ).populate('comments.user', 'username email');
  }

  async updateComment(incidentId, commentId, text) {
    return Incident.findOneAndUpdate(
      { 
        _id: incidentId,
        'comments._id': commentId 
      },
      { 
        $set: { 'comments.$.text': text }
      },
      { new: true }
    ).populate('comments.user', 'username email');
  }
} 
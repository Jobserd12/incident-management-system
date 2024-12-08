import Incident from '../models/incident.model.js';
import { cacheHelper } from '../utils/cache.helper.js';
import mongoose from 'mongoose';

export class IncidentRepository {
  constructor() {
    this.model = Incident;
  }

  async create(incidentData) {
    return this.model.create(incidentData);
  }

  async findById(id) {
    return this.model.findById(id)
      .populate('reportedBy', 'username email')
      .populate('assignedTo', 'username email');
  }

  async update(id, updateData) {
    return this.model.findByIdAndUpdate(id, updateData, { new: true });
  }

  async findSimilarPending(userId, title) {
    return this.model.findOne({
      reportedBy: userId,
      title: { $regex: title, $options: 'i' },
      status: { $in: ['nuevo', 'en_progreso'] }
    });
  }

  async countActiveByUser(userId) {
    return this.model.countDocuments({
      reportedBy: userId,
      status: { $in: ['nuevo', 'en_progreso'] }
    });
  }

  async findByFilters({
    status,
    priority,
    category,
    startDate,
    endDate,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  }) {
    try {
      const query = {};
      
      if (status) query.status = status;
      if (priority) query.priority = priority;
      if (category) query.category = category;
      
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      // Configurar ordenamiento
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Calcular skip para paginación
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Ejecutar consulta
      const [incidents, total] = await Promise.all([
        this.model.find(query)
          .populate('reportedBy', 'username email')
          .populate('assignedTo', 'username email')
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(), 
        this.model.countDocuments(query)
      ]);

      return {
        items: incidents,
        total
      };
    } catch (error) {
      throw new Error(`Error en findByFilters: ${error.message}`);
    }
  }

  async assignTo(incidentId, assignmentData) {
    return this.model.findByIdAndUpdate(
      incidentId,
      assignmentData,
      { 
        new: true,
        runValidators: true 
      }
    ).populate('reportedBy', 'username email')
     .populate('assignedTo', 'username email')
     .populate('assignmentHistory.assignedTo', 'username email')
     .populate('assignmentHistory.assignedBy', 'username email');
  }

  async updateStatus(id, updateData) {
    return this.model.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('reportedBy', 'username email')
     .populate('assignedTo', 'username email');
  }

  // Métodos de estadísticas
  async getStatsByStatus() {
    return this.model.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
  }

  async getAverageResolutionTime() {
    return this.model.aggregate([
      {
        $match: { status: 'resuelto' }
      },
      {
        $group: {
          _id: null,
          avgTime: {
            $avg: { $subtract: ['$resolvedAt', '$createdAt'] }
          }
        }
      }
    ]);
  }

  async invalidateListCache() {
    cacheHelper.invalidate('incidents:');
  }

  async findByTechnician(technicianId, filters = {}) {
    const query = {
      assignedTo: technicianId,
      ...filters
    };

    return this.model.find(query)
      .populate('reportedBy', 'username email')
      .populate('assignedTo', 'username email')
      .populate('assignmentHistory.assignedTo', 'username email')
      .populate('assignmentHistory.assignedBy', 'username email')
      .sort({ createdAt: -1 });
  }

  async getTechnicianWorkload(technicianId) {
    return this.model.aggregate([
      {
        $match: {
          assignedTo: new mongoose.Types.ObjectId(technicianId),
          status: { $in: ['nuevo', 'en_progreso'] }
        }
      },
      {
        $facet: {
          byStatus: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
                incidents: {
                  $push: {
                    _id: '$_id',
                    title: '$title',
                    priority: '$priority',
                    dueDate: '$dueDate'
                  }
                }
              }
            }
          ],
          byPriority: [
            {
              $group: {
                _id: '$priority',
                count: { $sum: 1 }
              }
            }
          ],
          total: [
            {
              $group: {
                _id: null,
                count: { $sum: 1 }
              }
            }
          ]
        }
      },
      {
        $project: {
          totalActive: { $arrayElemAt: ['$total.count', 0] },
          byStatus: 1,
          byPriority: 1
        }
      }
    ]);
  }

  async findAttachmentsByHash(incidentId, contentHash) {
    const incident = await this.model.findOne(
      { 
        _id: incidentId,
        'attachments.contentHash': contentHash 
      },
      { 
        'attachments.$': 1 
      }
    );
    return incident?.attachments[0];
  }

  async addAttachments(incidentId, attachments) {
    return this.model.findByIdAndUpdate(
      incidentId,
      { 
        $push: { 
          attachments: { 
            $each: attachments 
          } 
        } 
      },
      { 
        new: true,
        runValidators: true 
      }
    ).populate('attachments.uploadedBy', 'name email');
  }

  async removeAttachment(incidentId, attachmentId) {
    return this.model.findByIdAndUpdate(
      incidentId,
      {
        $pull: {
          attachments: { _id: attachmentId }
        }
      },
      { new: true }
    );
  }

  async findByIdDetailed(id) {
    return this.model.findById(id)
      .populate('reportedBy', 'username email')
      .populate('assignedTo', 'username email')
      .populate('assignmentHistory.assignedTo', 'username email')
      .populate('assignmentHistory.assignedBy', 'username email')
      .populate('changeHistory.changedBy', 'username email')
      .populate('comments.user', 'username email')
      .populate('attachments.uploadedBy', 'username email')
      .populate({
        path: 'parentIncident',
        select: 'title status priority',
        populate: {
          path: 'assignedTo',
          select: 'username email'
        }
      })
      .populate({
        path: 'childIncidents',
        select: 'title status priority',
        populate: {
          path: 'assignedTo',
          select: 'username email'
        }
      });
  }

  async linkIncidents(parentId, childId, type = 'relación') {
    try {
      const [updatedParent, updatedChild] = await Promise.all([
        this.model.findByIdAndUpdate(
          parentId,
          { 
            $addToSet: { 
              childIncidents: {
                incident: childId,
                relationType: type
              }
            }
          },
          { new: true }
        ).populate({
          path: 'childIncidents.incident',
          select: 'title status'
        }),

        this.model.findByIdAndUpdate(
          childId,
          { 
            parentIncident: parentId
          },
          { new: true }
        )
      ]);

      return updatedParent;

    } catch (error) {
      throw error;
    }
  }

  async validateRelationshipCycle(parentId, childId, visited = new Set()) {
    if (visited.has(parentId.toString())) return true;
    if (parentId.toString() === childId.toString()) return true;
    
    visited.add(parentId.toString());
    
    const parent = await this.findById(parentId);
    if (!parent || !parent.childIncidents.length) return false;
    
    for (const childRelation of parent.childIncidents) {
      if (await this.validateRelationshipCycle(childRelation.incident, childId, visited)) {
        return true;
      }
    }
    
    return false;
  }

  async unlinkIncidents(parentId, childId) {
    try {
      const [updatedParent, updatedChild] = await Promise.all([
        this.model.findByIdAndUpdate(
          parentId,
          { 
            $pull: { 
              childIncidents: {
                incident: childId
              }
            }
          },
          { new: true }
        ).populate({
          path: 'childIncidents.incident',
          select: 'title status'
        }),

        this.model.findByIdAndUpdate(
          childId,
          { 
            $unset: { 
              parentIncident: "" 
            }
          },
          { new: true }
        )
      ]);

      return updatedParent;

    } catch (error) {
      throw error;
    }
  }

  async getRelationships(incidentId) {
    const incident = await this.model.findById(incidentId)
      .populate({
        path: 'parentIncident',
        select: 'title status priority ticketNumber',
        populate: {
          path: 'assignedTo',
          select: 'username email'
        }
      })
      .populate({
        path: 'childIncidents.incident',
        select: 'title status priority ticketNumber',
        populate: {
          path: 'assignedTo',
          select: 'username email'
        }
      });

    if (!incident) return null;

    return {
      parent: incident.parentIncident,
      children: incident.childIncidents.map(child => ({
        incident: child.incident,
        relationType: child.relationType
      }))
    };
  }

  async updateRelationType(parentId, childId, type) {
    return this.model.findOneAndUpdate(
      { 
        _id: parentId,
        'childIncidents.incident': childId
      },
      { 
        $set: { 
          'childIncidents.$.relationType': type
        }
      },
      { 
        new: true 
      }
    ).populate({
      path: 'childIncidents.incident',
      select: 'title status'
    });
  }
} 
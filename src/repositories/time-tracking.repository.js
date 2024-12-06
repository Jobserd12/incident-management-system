import Incident from '../models/incident.model.js';
import { formatTimeSpent } from '../utils/time.helper.js';

export class TimeTrackingRepository {
  async findById(id) {
    return Incident.findById(id)
      .populate('assignedTo', 'username email');
  }

  async startWork(id, estimated) {
    const updates = {
      status: 'en_progreso',
      'timeTracking.started': new Date(),
      'timeTracking.paused': null
    };

    if (estimated !== undefined) {
      updates['timeTracking.estimated'] = estimated;
    }

    return Incident.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    ).populate('assignedTo', 'username email');
  }

  async pauseWork(id) {
    const incident = await Incident.findById(id);
    const now = new Date();
    const timeSpent = formatTimeSpent(incident.timeTracking.started, now);

    return Incident.findByIdAndUpdate(
      id,
      { 
        $set: {
          'timeTracking.paused': now,
          'timeTracking.spent': timeSpent.formatted,
          'timeTracking.started': null
        }
      },
      { new: true }
    ).populate('assignedTo', 'username email');
  }

  async getTimeMetrics() {
    return Incident.aggregate([
      {
        $match: {
          status: { $in: ['resuelto', 'cerrado'] },
          'timeTracking.spent': { $exists: true, $ne: null }
        }
      },
      {
        $facet: {
          byCategory: [
            {
              $group: {
                _id: '$category',
                avgTime: { $avg: '$timeTracking.spent' },
                totalIncidents: { $sum: 1 }
              }
            }
          ],
          byPriority: [
            {
              $group: {
                _id: '$priority',
                avgTime: { $avg: '$timeTracking.spent' },
                totalIncidents: { $sum: 1 }
              }
            }
          ],
          estimatedVsActual: [
            {
              $match: {
                'timeTracking.estimated': { $exists: true, $gt: 0 }
              }
            },
            {
              $group: {
                _id: null,
                avgEstimated: { $avg: '$timeTracking.estimated' },
                avgActual: { $avg: '$timeTracking.spent' },
                totalIncidents: { $sum: 1 },
                accurateEstimates: {
                  $sum: {
                    $cond: [
                      { $lte: ['$timeTracking.spent', '$timeTracking.estimated'] },
                      1,
                      0
                    ]
                  }
                }
              }
            },
            {
              $project: {
                avgEstimated: 1,
                avgActual: 1,
                totalIncidents: 1,
                accurateEstimatesPercentage: {
                  $multiply: [
                    { $divide: ['$accurateEstimates', '$totalIncidents'] },
                    100
                  ]
                }
              }
            }
          ]
        }
      }
    ]);
  }
} 
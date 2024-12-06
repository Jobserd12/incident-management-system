import Incident from "../models/incident.model.js";

export class AdminController {
    async cleanupDeletedComments(req, res, next) {
      try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
        const result = await Incident.updateMany(
          { 
            $and: [
              { 'comments.deletedAt': { $ne: null } },           
              { 'comments.deletedAt': { $lt: thirtyDaysAgo } }, 
              { status: { $in: ['resuelto', 'cerrado'] } }     
            ]
          },
          {
            $pull: {
              comments: {
                $and: [
                  { deletedAt: { $ne: null } },
                  { deletedAt: { $lt: thirtyDaysAgo } }
                ]
              }
            }
          }
        );
        
        res.json({
          status: 'success',
          message: 'Limpieza de comentarios completada',
          data: {
            commentsRemoved: result.modifiedCount,
            cleanupDate: new Date(),
            olderThan: thirtyDaysAgo
          }
        });
      } catch (error) {
        next(error);
      }
    }
  }
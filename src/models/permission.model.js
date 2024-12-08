import mongoose from 'mongoose';

const PermissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  category: {
    type: String,
    enum: ['incident', 'comment', 'attachment', 'user', 'report'],
    required: true
  },
  action: {
    type: String,
    enum: ['create', 'read', 'update', 'delete', 'manage', 'assign', 'resolve'],
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Permission', PermissionSchema); 
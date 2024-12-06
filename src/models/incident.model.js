import mongoose from 'mongoose';

const IncidentSchema = new mongoose.Schema({
  // Información básica
  title: {
    type: String,
    required: true,
    trim: true,
  },
  
  description: {
    type: String,
    required: true,
    trim: true,
  },

  // Clasificación
  priority: {
    type: String,
    required: true,
    enum: ['baja', 'media', 'alta', 'crítica'],
    default: 'media'
  },
  
  status: {
    type: String,
    required: true,
    enum: ['nuevo', 'en_progreso', 'resuelto', 'cerrado', 'rechazado'],
    default: 'nuevo'
  },
  
  category: {
    type: String,
    required: true,
    enum: ['hardware', 'software', 'red', 'seguridad', 'accesos', 'otros']
  },

  // Etiquetas para mejor organización
  tags: [{
    type: String,
    trim: true
  }],

  // Usuarios relacionados
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Seguimiento de tiempo
  timeTracking: {
    estimated: {
      type: Number,
      min: 0,
      default: 0
    },
    spent: {
      type: String,
      default: '0s'
    },
    started: {
      type: Date,
      default: null
    },
    paused: {
      type: Date,
      default: null
    }
  },

  // Relaciones entre incidencias
  parentIncident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident',
    default: null
  },

  childIncidents: [{
    incident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident'
    },
    relationType: {
      type: String,
      enum: ['dependencia', 'relación'],
      default: 'relación'
    }
  }],

  // Comentarios y archivos adjuntos
  comments: [{
    text: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    deletedAt: {
      type: Date,
      default: null
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  }],
  
  attachments: [{
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    description: {
      type: String,
      trim: true,
      maxLength: 200
    }
  }],

  resolution: {
    type: String,
    trim: true
  },

  dueDate: {
    type: Date,
    required: true
  },

  ticketNumber: {
    type: String,
    unique: true,
    default: null 
  },

  changeHistory: [{
    field: {
      type: String,
      required: true
    },
    oldValue: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    changedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Historial de asignaciones
  assignmentHistory: [{
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    reason: {
      type: String,
      trim: true
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejor rendimiento
IncidentSchema.index({ status: 1, priority: 1 });
IncidentSchema.index({ assignedTo: 1, status: 1 });
IncidentSchema.index({ category: 1, createdAt: -1 });
IncidentSchema.index({ tags: 1 });
IncidentSchema.index({ createdAt: -1 });
IncidentSchema.index({ dueDate: 1, status: 1 });
IncidentSchema.index({ ticketNumber: 1 }, { unique: true });
IncidentSchema.index({ 
  title: 'text', 
  description: 'text' 
}, {
  weights: {
    title: 10,
    description: 5
  },
  name: "SearchIndex"
});

// Virtual para verificar si está vencido
IncidentSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.status === 'resuelto' || this.status === 'cerrado') {
    return false;
  }
  return Date.now() > this.dueDate;
});

// Función para generar el número de ticket
async function generateTicketNumber() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  // Encontrar el último ticket del mes actual
  const lastTicket = await this.constructor.findOne({
    ticketNumber: new RegExp(`^INC-${year}${month}-`)
  }, {}, { sort: { 'ticketNumber': -1 } });

  let sequence = 1;
  if (lastTicket) {
    const lastSequence = parseInt(lastTicket.ticketNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }

  // Formato: INC-YYMM-XXXXX
  return `INC-${year}${month}-${sequence.toString().padStart(5, '0')}`;
}

// Middleware pre-save para generar el número de ticket
IncidentSchema.pre('save', async function(next) {
  if (!this.ticketNumber) {
    this.ticketNumber = await generateTicketNumber.call(this);
  }
  next();
});

// Métodos estáticos para reportes
IncidentSchema.statics = {
  // Obtener estadísticas generales
  async getStats() {
    return this.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          porEstado: {
            $push: {
              estado: '$status',
              cantidad: 1
            }
          },
          tiempoPromedioResolucion: {
            $avg: '$timeTracking.spent'
          }
        }
      }
    ]);
  },

  // Obtener incidencias por categoría
  async getByCategory() {
    return this.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
  },

  // Obtener incidencias relacionadas
  async getRelated(incidentId) {
    const incident = await this.findById(incidentId);
    if (!incident) return [];

    return this.find({
      $or: [
        { _id: { $in: incident.childIncidents } },
        { parentIncident: incidentId }
      ]
    });
  }
};

const Incident = mongoose.model('Incident', IncidentSchema);

export default Incident;
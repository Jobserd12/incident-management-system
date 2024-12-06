import mongoose from 'mongoose';
import config from '../config/config.js';
import User from '../models/user.model.js';
import Incident from '../models/incident.model.js';

const seedIncidents = [
  {
    title: 'Error crítico en sistema de autenticación',
    description: 'Los usuarios reportan que no pueden acceder al sistema desde Chrome y Firefox. Se requiere atención inmediata.',
    priority: 'crítica',
    status: 'nuevo',
    category: 'software',
    tags: ['autenticación', 'chrome', 'firefox', 'urgente'],
    timeTracking: {
      estimated: 120,
      spent: 0,
      started: null,
      paused: null
    },
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
    comments: [
      {
        text: 'Iniciando investigación del problema',
        createdAt: new Date()
      }
    ],
    attachments: [
      {
        filename: 'error_screenshot.png',
        path: '/uploads/error_screenshot.png',
        mimetype: 'image/png',
        size: 1024576,
        uploadedAt: new Date()
      }
    ]
  },
  {
    title: 'Fallo en impresora departamento ventas',
    description: 'La impresora HP LaserJet del departamento de ventas no responde. Ya se intentó reiniciar sin éxito.',
    priority: 'alta',
    status: 'en_progreso',
    category: 'hardware',
    tags: ['impresora', 'hardware', 'ventas'],
    timeTracking: {
      estimated: 60,
      spent: 15,
      started: new Date(),
      paused: null
    },
    dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 horas
    comments: [
      {
        text: 'Revisando drivers de la impresora',
        createdAt: new Date()
      }
    ]
  },
  {
    title: 'Actualización pendiente de antivirus corporativo',
    description: 'Se requiere actualizar el software antivirus en todas las estaciones de trabajo. Planificar ventana de mantenimiento.',
    priority: 'media',
    status: 'nuevo',
    category: 'seguridad',
    tags: ['antivirus', 'actualización', 'mantenimiento'],
    timeTracking: {
      estimated: 240,
      spent: 0,
      started: null,
      paused: null
    },
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 semana
    comments: [
      {
        text: 'Programando actualización para el fin de semana',
        createdAt: new Date()
      }
    ]
  },
  {
    title: 'Solicitud de acceso a servidor de desarrollo',
    description: 'Nuevo desarrollador requiere acceso al servidor de desarrollo y repositorios de código.',
    priority: 'baja',
    status: 'nuevo',
    category: 'accesos',
    tags: ['accesos', 'desarrollo', 'permisos'],
    timeTracking: {
      estimated: 30,
      spent: 0,
      started: null,
      paused: null
    },
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 días
    comments: [
      {
        text: 'Verificando políticas de acceso',
        createdAt: new Date()
      }
    ]
  }
];

async function seedIncidentsOnly() {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('📦 Conectado a MongoDB');

    // Obtener usuarios existentes
    const regularUser = await User.findOne({ role: 'user' });
    const supportUser = await User.findOne({ role: 'support' });

    if (!regularUser || !supportUser) {
      throw new Error('❌ No se encontraron los usuarios necesarios en la base de datos');
    }

    // Limpiar solo incidentes
    await Incident.deleteMany({});
    console.log('🧹 Incidentes anteriores eliminados');

    // Preparar incidentes con referencias a usuarios existentes
    const incidents = seedIncidents.map((incident) => ({
      ...incident,
      reportedBy: regularUser._id,
      assignedTo: supportUser._id,
      comments: incident.comments.map(comment => ({
        ...comment,
        user: supportUser._id
      })),
      attachments: incident.attachments?.map(attachment => ({
        ...attachment,
        uploadedBy: regularUser._id
      })) || []
    }));

    // Crear incidentes
    const createdIncidents = await Incident.create(incidents);
    console.log(`✅ ${createdIncidents.length} incidentes creados exitosamente`);

    // Mostrar resumen
    console.log('\n📊 Resumen de incidentes creados:');
    const stats = await Incident.getStats();
    console.log(stats);

  } catch (error) {
    console.error('❌ Error durante la creación de incidentes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Desconectado de MongoDB');
  }
}

seedIncidentsOnly().catch(console.error); 
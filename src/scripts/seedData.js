import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../config/config.js';
import User from '../models/user.model.js';
import Incident from '../models/incident.model.js';

// Datos iniciales de usuarios
const seedUsers = [
  {
    username: 'admin',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    isVerified: true
  },
  {
    username: 'support',
    name: 'Tech Support',
    email: 'support@example.com',
    password: 'support123',
    role: 'support',
    isVerified: true
  },
  {
    username: 'user',
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    isVerified: true
  }
];

// Datos de incidentes actualizados según el modelo
const seedIncidents = [
  {
    title: 'Error crítico en sistema de autenticación',
    description: 'Los usuarios reportan que no pueden acceder al sistema desde Chrome y Firefox. Se requiere atención inmediata.',
    priority: 'crítica',
    status: 'nuevo',
    category: 'software',
    comments: [
      {
        text: 'Iniciando investigación del problema',
      }
    ],
    attachments: [
      {
        filename: 'error_screenshot.png',
        path: '/uploads/error_screenshot.png',
        mimetype: 'image/png',
        size: 1024576
      }
    ]
  },
  {
    title: 'Fallo en impresora departamento ventas',
    description: 'La impresora HP LaserJet del departamento de ventas no responde. Ya se intentó reiniciar sin éxito.',
    priority: 'alta',
    status: 'en_progreso',
    category: 'hardware',
    comments: [
      {
        text: 'Revisando drivers de la impresora',
      }
    ]
  },
  {
    title: 'Actualización pendiente de antivirus corporativo',
    description: 'Se requiere actualizar el software antivirus en todas las estaciones de trabajo. Planificar ventana de mantenimiento.',
    priority: 'media',
    status: 'nuevo',
    category: 'seguridad',
    comments: [
      {
        text: 'Programando actualización para el fin de semana',
      }
    ]
  },
  {
    title: 'Solicitud de acceso a servidor de desarrollo',
    description: 'Nuevo desarrollador requiere acceso al servidor de desarrollo y repositorios de código.',
    priority: 'baja',
    status: 'nuevo',
    category: 'accesos',
    comments: [
      {
        text: 'Verificando políticas de acceso',
      }
    ]
  }
];

async function seedDatabase() {
  let session;
  
  try {
    // Conectar a MongoDB (solo una vez)
    await mongoose.connect(config.mongodb.uri);
    console.log('📦 Conectado a MongoDB');

    // Limpiar base de datos inicial
    console.log('🧹 Limpiando base de datos...');
    await Promise.all([
      User.deleteMany({}),
      Incident.deleteMany({})
    ]);
    
    // Verificar si podemos usar transacciones
    const isReplicaSet = await mongoose.connection.db.admin().command({ replSetGetStatus: 1 })
      .then(() => true)
      .catch(() => false);

    if (!isReplicaSet) {
      console.log('⚠️ No hay soporte para transacciones - procediendo sin ellas');
      return await seedWithoutTransaction();
    }

    // Iniciar sesión de transacción
    session = await mongoose.startSession();
    session.startTransaction();
    console.log('🔄 Iniciando transacción...');

    // Limpiar base de datos dentro de la transacción
    await Promise.all([
      User.deleteMany({}).session(session),
      Incident.deleteMany({}).session(session)
    ]);
    console.log('🧹 Base de datos limpiada');

    // Crear usuarios dentro de la transacción
    const createdUsers = await Promise.all(
      seedUsers.map(async (userData) => {
        return User.create(userData);
      })
    );
    console.log(`👥 ${createdUsers.length} usuarios creados`);

    // Preparar incidentes con referencias
    const incidents = seedIncidents.map((incident) => ({
      ...incident,
      reportedBy: createdUsers[2]._id,
      assignedTo: createdUsers[1]._id,
      comments: incident.comments.map(comment => ({
        ...comment,
        user: createdUsers[1]._id
      })),
      attachments: incident.attachments?.map(attachment => ({
        ...attachment,
        uploadedBy: createdUsers[2]._id
      })) || []
    }));

    // Crear incidentes dentro de la transacción
    const createdIncidents = await Incident.create(incidents, { session });
    console.log(`🎫 ${createdIncidents.length} incidentes creados`);

    // Si todo está bien, confirmar la transacción
    await session.commitTransaction();
    console.log('✅ Transacción completada exitosamente');

    // Mostrar resumen
    console.log('\n📊 Resumen de la migración:');
    console.log(`- ${createdUsers.length} usuarios creados`);
    console.log(`- ${createdIncidents.length} incidentes creados`);
    
    // Mostrar credenciales
    console.log('\n🔑 Credenciales de acceso:');
    seedUsers.forEach(user => {
      console.log(`${user.role.toUpperCase()}:`);
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}\n`);
    });

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    if (session) {
      await session.abortTransaction();
      console.log('⚠️ Transacción revertida');
    }
  } finally {
    if (session) {
      session.endSession();
    }
    await mongoose.disconnect();
    console.log('📤 Desconectado de MongoDB');
  }
}

// Agregar la función seedWithoutTransaction
async function seedWithoutTransaction() {
  try {
    // Limpiar base de datos
    await Promise.all([
      User.deleteMany({}),
      Incident.deleteMany({})
    ]);
    console.log('🧹 Base de datos limpiada');

    // Crear usuarios
    const createdUsers = await Promise.all(
      seedUsers.map(async (userData) => {
        console.log(`Creando usuario: ${userData.username}`);
        const user = await User.create(userData);
        console.log(`Password hasheado para ${userData.username}:`, user.password);
        return user;
      })
    );
    console.log(`👥 ${createdUsers.length} usuarios creados`);

    // Preparar y crear incidentes
    const incidents = seedIncidents.map((incident) => ({
      ...incident,
      reportedBy: createdUsers[2]._id,
      assignedTo: createdUsers[1]._id,
      comments: incident.comments.map(comment => ({
        ...comment,
        user: createdUsers[1]._id
      })),
      attachments: incident.attachments?.map(attachment => ({
        ...attachment,
        uploadedBy: createdUsers[2]._id
      })) || []
    }));

    const createdIncidents = await Incident.create(incidents);
    console.log(`🎫 ${createdIncidents.length} incidentes creados`);

    // Mostrar resumen
    console.log('\n📊 Resumen de la migración:');
    console.log(`- ${createdUsers.length} usuarios creados`);
    console.log(`- ${createdIncidents.length} incidentes creados`);
    
    // Mostrar credenciales
    console.log('\n🔑 Credenciales de acceso:');
    seedUsers.forEach(user => {
      console.log(`${user.role.toUpperCase()}:`);
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}\n`);
    });

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  }
}

// La llamada al seed permanece igual
seedDatabase().catch(console.error); 
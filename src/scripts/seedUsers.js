import mongoose from 'mongoose';
import config from '../config/config.js';
import User from '../models/user.model.js';

const seedUsers = [
  {
    username: 'admin',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    isVerified: true,
    emailVerification: {
      token: null,
      expiresAt: null,
      resendCount: 0,
      lastResend: null
    },
    passwordChanges: {
      count: 0,
      lastChange: null,
      lastReset: new Date()
    }
  },
  {
    username: 'support',
    name: 'Tech Support',
    email: 'support@example.com',
    password: 'support123',
    role: 'support',
    isVerified: true,
    emailVerification: {
      token: null,
      expiresAt: null,
      resendCount: 0,
      lastResend: null
    },
    passwordChanges: {
      count: 0,
      lastChange: null,
      lastReset: new Date()
    }
  },
  {
    username: 'user',
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    isVerified: true,
    emailVerification: {
      token: null,
      expiresAt: null,
      resendCount: 0,
      lastResend: null
    },
    passwordChanges: {
      count: 0,
      lastChange: null,
      lastReset: new Date()
    }
  }
];

async function initializeUsers() {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('📦 Conectado a MongoDB');

    // Limpiar solo usuarios
    await User.deleteMany({});
    console.log('🧹 Usuarios anteriores eliminados');

    // Crear usuarios
    const createdUsers = await Promise.all(
      seedUsers.map(async (userData) => {
        console.log(`👤 Creando usuario: ${userData.username}`);
        const user = await User.create(userData);
        return user;
      })
    );

    console.log(`✅ ${createdUsers.length} usuarios creados exitosamente`);

    // Mostrar credenciales
    console.log('\n🔑 Credenciales de acceso:');
    seedUsers.forEach(user => {
      console.log(`${user.role.toUpperCase()}:`);
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}\n`);
    });

  } catch (error) {
    console.error('❌ Error durante la creación de usuarios:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Desconectado de MongoDB');
  }
}

initializeUsers().catch(console.error); 
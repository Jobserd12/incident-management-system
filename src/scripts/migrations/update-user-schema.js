import mongoose from 'mongoose';
import config from '../../config/config.js';

const migration = async () => {
  try {
    // Conectar a MongoDB
    console.log('🔄 Iniciando migración...');
    await mongoose.connect(config.mongodb.uri);
    console.log('📦 Conectado a MongoDB');

    // Obtener la colección de usuarios
    const db = mongoose.connection.db;
    const users = db.collection('users');

    // Crear backup
    console.log('💾 Creando backup...');
    await db.collection('users_backup').drop().catch(() => {}); // Eliminar backup anterior si existe
    const backup = await users.find({}).toArray();
    await db.collection('users_backup').insertMany(backup);
    console.log('✅ Backup creado exitosamente');

    // Actualizar documentos con la nueva estructura
    console.log('🔄 Actualizando esquema de usuarios...');
    const result = await users.updateMany(
      {}, // Actualizar todos los documentos
      {
        $set: {
          isVerified: true, // Usuarios existentes se marcan como verificados
          emailVerification: null,
          emailChange: null,
          passwordReset: null
        }
      }
    );

    // Agregar índices necesarios
    console.log('📑 Creando índices...');
    await users.createIndex({ email: 1 }, { unique: true });
    await users.createIndex({ username: 1 }, { unique: true });
    await users.createIndex({ 'emailVerification.token': 1 });
    await users.createIndex({ 'emailChange.token': 1 });
    await users.createIndex({ 'passwordReset.token': 1 });

    console.log('✅ Migración completada exitosamente');
    console.log(`📊 Estadísticas:
      - Documentos encontrados: ${backup.length}
      - Documentos actualizados: ${result.modifiedCount}
      - Índices creados: 5
    `);

    // Verificar la estructura actualizada
    const sampleUser = await users.findOne({});
    console.log('\n📋 Ejemplo de documento actualizado:');
    console.log(JSON.stringify(sampleUser, null, 2));

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    // Intentar restaurar desde el backup en caso de error
    try {
      const db = mongoose.connection.db;
      await db.collection('users').drop();
      await db.collection('users').insertMany(backup);
      console.log('🔄 Restaurado desde backup');
    } catch (restoreError) {
      console.error('❌ Error al restaurar backup:', restoreError);
    }
  } finally {
    await mongoose.disconnect();
    console.log('📦 Desconectado de MongoDB');
    process.exit(0);
  }
};

// Agregar manejo de señales para limpieza
process.on('SIGINT', async () => {
  console.log('\n⚠️ Migración interrumpida');
  await mongoose.disconnect();
  process.exit(1);
});

migration(); 
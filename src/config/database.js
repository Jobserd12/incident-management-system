import mongoose from 'mongoose';
import config from './config.js';
import { timestampsPlugin } from '../utils/timestamps.plugin.js';

const connectDB = async () => {
  try {
    mongoose.plugin(timestampsPlugin);
    const conn = await mongoose.connect(config.mongodb.uri);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
    console.log(`Base de datos actual: ${conn.connection.name}`);
    console.log(`Puerto: ${conn.connection.port}`);
    console.log(`Estado de la conexión: ${conn.connection.readyState === 1 ? 'Conectado' : 'Desconectado'}`);
  } catch (error) {
    console.error('Error al conectar MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
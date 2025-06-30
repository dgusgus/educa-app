import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Conexión y desconexión para tests
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('📦 Conectado a la base de datos');
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
};

export default prisma;
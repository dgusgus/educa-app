// src/config/environment.ts - Configuración de variables de entorno
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Validar que las variables críticas estén presentes
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Variable de entorno requerida no encontrada: ${envVar}`);
    process.exit(1);
  }
}

// Configuración centralizada
export const config = {
  // Servidor
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  
  // Base de datos
  DATABASE_URL: process.env.DATABASE_URL!,
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutos
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  
  // Bcrypt
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
} as const;

// Validar configuración
export const validateConfig = (): boolean => {
  try {
    // Validar PORT
    if (config.PORT < 1 || config.PORT > 65535) {
      console.error('❌ Puerto debe estar entre 1 y 65535');
      return false;
    }
    
    // Validar JWT_SECRET longitud
    if (config.JWT_SECRET.length < 32) {
      console.error('❌ JWT_SECRET debe tener al menos 32 caracteres');
      return false;
    }
    
    // Validar DATABASE_URL formato
    if (!config.DATABASE_URL.startsWith('postgresql://')) {
      console.error('❌ DATABASE_URL debe ser una URL de PostgreSQL válida');
      return false;
    }
    
    console.log('✅ Configuración validada correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error validando configuración:', error);
    return false;
  }
};

// Mostrar configuración en desarrollo
if (config.NODE_ENV === 'development') {
  console.log('🔧 Configuración cargada:');
  console.log({
    NODE_ENV: config.NODE_ENV,
    PORT: config.PORT,
    DATABASE_URL: config.DATABASE_URL.replace(/:[^:@]*@/, ':****@'), // Ocultar password
    JWT_SECRET: '****' + config.JWT_SECRET.slice(-4), // Mostrar solo últimos 4 caracteres
    CORS_ORIGIN: config.CORS_ORIGIN
  });
}
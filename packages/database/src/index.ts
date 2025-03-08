import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Export your database models and utilities here
export * from './models'; 
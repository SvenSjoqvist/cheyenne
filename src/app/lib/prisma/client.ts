import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: "postgresql://kilaeko_owner:npg_6KCb9vrwLPyx@ep-shy-paper-a8ymnliq-pooler.eastus2.azure.neon.tech/kilaeko?sslmode=require"
      }
    }
  });
};

type GlobalWithPrisma = typeof globalThis & {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined;
};

const prisma = (globalThis as GlobalWithPrisma).prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  (globalThis as GlobalWithPrisma).prisma = prisma;
}

export { prisma }; 
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function addSubscriber(email: string) {
  try {
    const subscriber = await prisma.subscriber.create({
      data: {
        email,
      },
    });
    return subscriber;
  } catch (error) {
    console.error('Error adding subscriber:', error);
    throw new Error('Failed to add subscriber');
  }
}

export async function getSubscribers() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return subscribers;
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    throw new Error('Failed to fetch subscribers');
  }
} 
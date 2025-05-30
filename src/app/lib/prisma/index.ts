'use server'

import { prisma } from './client';
import { sendWelcomeEmail } from '@/app/actions/newsletter';

export async function addSubscriber(email: string) {
  try {
    const subscriber = await prisma.subscriber.create({
      data: {
        createdAt: new Date(),
        email: email,
        updatedAt: new Date(),
      },
    });

    // Send welcome email
    await sendWelcomeEmail(email);

    return subscriber;
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('Unique constraint failed on the fields: (`email`)')) {
      throw new Error('Email already exists');
    }
    throw new Error('Failed to add subscriber');
  }
}

export async function getSubscribers() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return subscribers;
  } catch (error) {
    console.error('Failed to fetch subscribers:', error);
    throw new Error('Failed to fetch subscribers');
  }
}
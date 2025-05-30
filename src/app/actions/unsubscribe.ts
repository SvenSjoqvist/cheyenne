'use server';

import { prisma } from '@/app/lib/prisma/client';

export async function unsubscribe(token: string) {
  try {
    if (!token) {
      return { success: false, message: 'Unsubscribe token is required' };
    }

    const subscriber = await prisma.subscriber.findUnique({
      where: { unsubscribeToken: token },
    });

    if (!subscriber) {
      return { success: false, message: 'Invalid unsubscribe token' };
    }

    await prisma.subscriber.delete({
      where: { id: subscriber.id },
    });

    return { success: true, message: 'Successfully unsubscribed' };
  } catch (error) {
    console.error('Failed to unsubscribe:', error);
    return { success: false, message: 'Failed to unsubscribe' };
  }
} 
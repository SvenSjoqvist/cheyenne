'use server'

import { prisma } from './client';
import { sendWelcomeEmail } from '@/app/actions/newsletter';

export async function addSubscriber(email: string) {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Check if subscriber already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email }
    });

    if (existingSubscriber) {
      // Return success for existing subscribers
      return { 
        success: true, 
        message: 'You are already subscribed to our newsletter!',
        isExisting: true 
      };
    }

    // Create new subscriber
    await prisma.subscriber.create({
      data: {
        email: email,
        unsubscribeToken: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Send welcome email
    try {
      await sendWelcomeEmail(email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't throw here, as the subscription was successful
    }

    return { 
      success: true, 
      message: 'Successfully subscribed to our newsletter!',
      isExisting: false 
    };
  } catch (error) {
    console.error('Failed to add subscriber:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
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
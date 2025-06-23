'use server';

import { prisma } from '@/app/lib/prisma';

export async function subscribeToNewsletter(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    
    if (!email) {
      throw new Error('Email is required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Check if subscriber already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email }
    });

    if (existingSubscriber) {
      throw new Error('This email is already subscribed to our newsletter');
    }

    // Create new subscriber
    await prisma.subscriber.create({
      data: {
        email,
      },
    });

    return { success: true, message: 'Thank you for subscribing to our newsletter!' };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.' 
    };
  }
} 
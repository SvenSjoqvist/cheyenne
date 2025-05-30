'use server';

import { prisma } from '@/app/lib/prisma/client';

export async function ensureWelcomeTemplate() {
  try {
    const existingTemplate = await prisma.emailTemplate.findFirst({
      where: {
        name: 'signedup'
      }
    });

    if (!existingTemplate) {
      await prisma.emailTemplate.create({
        data: {
          name: 'signedup',
          subject: 'Welcome to Our Newsletter!',
          content: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #333; text-align: center;">Welcome to Our Newsletter!</h1>
              <p style="color: #666; line-height: 1.6;">
                Thank you for subscribing to our newsletter! We're excited to have you join our community.
              </p>
              <p style="color: #666; line-height: 1.6;">
                You'll be the first to know about our latest updates, special offers, and exclusive content.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                  Visit Our Website
                </a>
              </div>
              <p style="color: #999; font-size: 12px; text-align: center;">
                If you wish to unsubscribe, you can do so at any time by clicking the unsubscribe link in our emails.
              </p>
            </div>
          `
        }
      });
    }
  } catch (error) {
    console.error('Failed to ensure welcome template:', error);
  }
}

export async function createTemplate(name: string, subject: string, content: string) {
  try {
    const template = await prisma.emailTemplate.create({
      data: {
        name,
        subject,
        content,
      },
    });
    return template;
  } catch (error) {
    console.error('Failed to create template:', error);
    throw new Error('Failed to create template');
  }
}

export async function getTemplates() {
  try {
    const templates = await prisma.emailTemplate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return templates;
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    throw new Error('Failed to fetch templates');
  }
}

export async function deleteTemplate(id: string) {
  try {
    await prisma.emailTemplate.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete template:', error);
    throw new Error('Failed to delete template');
  }
}

export async function updateTemplate(id: string, name: string, subject: string, content: string) {
  try {
    const template = await prisma.emailTemplate.update({
      where: { id },
      data: {
        name,
        subject,
        content,
        updatedAt: new Date(),
      },
    });
    return template;
  } catch (error) {
    console.error('Failed to update template:', error);
    throw new Error('Failed to update template');
  }
} 
'use server';

import nodemailer from 'nodemailer';
import { prisma } from '@/app/lib/prisma/client';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function addUnsubscribeLink(content: string, unsubscribeToken: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${unsubscribeToken}`;
    return content.replace('{{unsubscribe_link}}', unsubscribeUrl);
  } catch (error) {
    throw error;
  }
}

export async function sendWelcomeEmail(email: string) {
  try {
    const subscriber = await prisma.subscriber.findUnique({
      where: { email }
    });

    if (!subscriber) {
      throw new Error('Subscriber not found');
    }

    const template = await prisma.emailTemplate.findFirst({
      where: {
        name: 'signedup'
      }
    });

    if (!template) {
      return;
    }

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: template.subject,
      html: addUnsubscribeLink(template.content, subscriber.unsubscribeToken),
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to send welcome email: ${error.message}`);
    }
    throw new Error('Failed to send welcome email');
  }
}

export async function sendNewsletter(subject: string, content: string, recipients: string[]) {
  try {
    if (!content) {
      throw new Error('Content is empty');
    }

    if (!recipients || recipients.length === 0) {
      throw new Error('No recipients provided');
    }

    const subscribers = await prisma.subscriber.findMany({
      where: {
        email: {
          in: recipients
        }
      }
    });

    if (subscribers.length === 0) {
      throw new Error('No subscribers found for the provided emails');
    }

    const sendPromises = subscribers.map(async (subscriber) => {
      try {
        if (!subscriber.unsubscribeToken) {
          throw new Error(`No unsubscribe token for subscriber: ${subscriber.email}`);
        }

        const mailOptions = {
          from: process.env.SMTP_FROM,
          to: subscriber.email,
          subject,
          html: addUnsubscribeLink(content, subscriber.unsubscribeToken),
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
      } catch (error) {
        throw error;
      }
    });

    const results = await Promise.all(sendPromises);
    return { success: true, messageIds: results.map(r => r.messageId) };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to send newsletter: ${error.message}`);
    }
    throw new Error('Failed to send newsletter');
  }
}

export async function sendTestEmail(email: string, subject: string, content: string) {
  try {
    const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingEnvVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }

    const testToken = 'test-token';
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: `[TEST] ${subject}`,
      html: addUnsubscribeLink(content, testToken),
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to send test email: ${error.message}`);
    }
    throw new Error('Failed to send test email: Unknown error');
  }
}
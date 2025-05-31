'use server';

import nodemailer from 'nodemailer';
import { prisma } from '@/app/lib/prisma/client';

// Create reusable transporter object using SMTP transport
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
    console.log('=== START addUnsubscribeLink ===');
    console.log('Content received:', content);
    console.log('Unsubscribe token:', unsubscribeToken);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${unsubscribeToken}`;
    
    console.log('Generated unsubscribe URL:', unsubscribeUrl);
    console.log('Content contains placeholder:', content.includes('{{unsubscribe_link}}'));

    const result = content.replace('{{unsubscribe_link}}', unsubscribeUrl);
    
    console.log('Final content:', result);
    console.log('=== END addUnsubscribeLink ===');

    return result;
  } catch (error) {
    console.error('Error in addUnsubscribeLink:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(email: string) {
  try {
    console.log('Sending welcome email to:', email);

    // Get the subscriber to get their unsubscribe token
    const subscriber = await prisma.subscriber.findUnique({
      where: { email }
    });

    if (!subscriber) {
      console.error('Subscriber not found:', email);
      throw new Error('Subscriber not found');
    }

    console.log('Found subscriber:', {
      id: subscriber.id,
      email: subscriber.email,
      hasUnsubscribeToken: !!subscriber.unsubscribeToken
    });

    // Get the welcome template
    const template = await prisma.emailTemplate.findFirst({
      where: {
        name: 'signedup'
      }
    });

    if (!template) {
      console.error('Welcome template not found');
      return;
    }

    console.log('Found welcome template:', {
      id: template.id,
      name: template.name,
      subject: template.subject,
      contentLength: template.content.length
    });

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: template.subject,
      html: addUnsubscribeLink(template.content, subscriber.unsubscribeToken),
    };

    console.log('Sending welcome email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      htmlLength: mailOptions.html.length
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', {
      messageId: info.messageId,
      response: info.response
    });
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
}

export async function sendNewsletter(subject: string, content: string, recipients: string[]) {
  try {
    console.log('=== START sendNewsletter ===');
    console.log('Subject:', subject);
    console.log('Content:', content);
    console.log('Recipients:', recipients);

    if (!content) {
      throw new Error('Content is empty');
    }

    if (!recipients || recipients.length === 0) {
      throw new Error('No recipients provided');
    }

    // Get all subscribers with their unsubscribe tokens
    const subscribers = await prisma.subscriber.findMany({
      where: {
        email: {
          in: recipients
        }
      }
    });

    console.log('Found subscribers:', subscribers);

    if (subscribers.length === 0) {
      throw new Error('No subscribers found for the provided emails');
    }

    // Send individual emails to include personal unsubscribe links
    const sendPromises = subscribers.map(async (subscriber) => {
      try {
        console.log(`Processing subscriber: ${subscriber.email}`);
        
        if (!subscriber.unsubscribeToken) {
          console.error(`No unsubscribe token for subscriber: ${subscriber.email}`);
          throw new Error(`No unsubscribe token for subscriber: ${subscriber.email}`);
        }

        const mailOptions = {
          from: process.env.SMTP_FROM,
          to: subscriber.email,
          subject,
          html: addUnsubscribeLink(content, subscriber.unsubscribeToken),
        };

        console.log('Mail options:', mailOptions);

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${subscriber.email}:`, info);
        return info;
      } catch (error) {
        console.error(`Error sending to ${subscriber.email}:`, error);
        throw error;
      }
    });

    const results = await Promise.all(sendPromises);
    console.log('All emails sent successfully:', results);
    console.log('=== END sendNewsletter ===');

    return { success: true, messageIds: results.map(r => r.messageId) };
  } catch (error: unknown) {
    if (error instanceof Error) {
    console.error('=== ERROR in sendNewsletter ===');
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
    throw new Error(`Failed to send newsletter: ${error.message}`);
    } else {
      console.error('Unknown error in sendNewsletter:', error);
      throw new Error('Failed to send newsletter');
    }
  }
}

export async function sendTestEmail(email: string, subject: string, content: string) {
  try {
    // Validate required environment variables
    const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingEnvVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }

    console.log('Sending test email:', {
      email,
      subject,
      contentLength: content.length
    });

    // For test emails, we'll use a dummy token since it's just for testing
    const testToken = 'test-token';
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: `[TEST] ${subject}`,
      html: addUnsubscribeLink(content, testToken),
    };

    console.log('Sending test email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      htmlLength: mailOptions.html.length
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully:', {
      messageId: info.messageId,
      response: info.response
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send test email:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to send test email: ${error.message}`);
    }
    throw new Error('Failed to send test email: Unknown error');
  }
} 
'use server';

import nodemailer from 'nodemailer';

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

export async function sendReturnRequest(orderNumber: number, items: { name: string, variant: string, reason: string }[], additionalNotes: string, customerEmail: string) {
  try {
    // Format date in YYYY-MM-DD format to avoid locale issues
    const currentDate = new Date().toISOString().split('T')[0];

    // Create email content with HTML and CSS
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #F7F7F7;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding: 20px 0;
    }
    .header h1 {
      font-size: 40px;
      font-weight: 500;
      margin: 0;
      color: #000;
    }
    .header p {
      font-size: 16px;
      color: #666;
      max-width: 80%;
      margin: 20px auto 0;
    }
    .section {
      margin-bottom: 30px;
      padding: 30px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .section-title {
      font-size: 32px;
      font-weight: 500;
      margin-bottom: 20px;
      color: #000;
    }
    .item {
      margin-bottom: 20px;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
      border: 1px solid #eee;
    }
    .item p {
      margin: 8px 0;
    }
    .item strong {
      color: #000;
    }
    .next-steps {
      background-color: #fff;
      padding: 30px;
      border-radius: 8px;
      margin-top: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .next-steps ul {
      margin: 0;
      padding-left: 20px;
      list-style-type: none;
    }
    .next-steps li {
      margin-bottom: 15px;
      position: relative;
      padding-left: 25px;
    }
    .next-steps li:before {
      content: "•";
      position: absolute;
      left: 0;
      color: #000;
      font-size: 20px;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 14px;
      color: #666;
      padding-top: 20px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #000;
      color: #fff;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 20px;
    }
    .button:hover {
      background-color: #333;
    }
    .info-text {
      font-size: 16px;
      color: #666;
      margin: 10px 0;
    }
    .highlight {
      color: #000;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Return Request</h1>
    <p>Thank you for submitting your return request. We'll review it shortly and get back to you.</p>
  </div>

  <div class="section">
    <div class="section-title">Order Information</div>
    <p class="info-text"><span class="highlight">Order Number:</span> #${orderNumber}</p>
    <p class="info-text"><span class="highlight">Customer Email:</span> ${customerEmail}</p>
    <p class="info-text"><span class="highlight">Request Date:</span> ${currentDate}</p>
  </div>

  <div class="section">
    <div class="section-title">Items to Return</div>
    ${items.map((item) => `
      <div class="item">
        <p><span class="highlight">Product:</span> ${item.name}</p>
        <p><span class="highlight">Variant:</span> ${item.variant}</p>
        <p><span class="highlight">Reason:</span> ${item.reason}</p>
      </div>
    `).join('')}
  </div>

  ${additionalNotes ? `
    <div class="section">
      <div class="section-title">Additional Notes</div>
      <p class="info-text">${additionalNotes}</p>
    </div>
  ` : ''}

  <div class="next-steps">
    <div class="section-title">Next Steps</div>
    <ul>
      <li>Our team will review your return request within 2-3 business days</li>
      <li>If approved, you'll receive return shipping instructions</li>
      <li>Once we receive and inspect the items, we'll process your refund</li>
      <li>If you have any questions about your return request, please contact our customer service team</li>
    </ul>
  </div>

  <div class="footer">
    <p>Kilaeko Customer Service</p>
    <a href="mailto:${process.env.SMTP_FROM}" class="button">Contact Support</a>
  </div>
</body>
</html>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_FROM,
      subject: `Return Request - Order #${orderNumber}`,
      html: emailContent,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send return request:', error);
    throw new Error('Failed to send return request');
  }
} 
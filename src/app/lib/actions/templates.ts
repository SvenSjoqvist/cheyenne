"use server";

import { prisma } from "@/app/lib/prisma/client";
import { protectServerAction } from "@/app/lib/auth-utils";
import { Prisma } from "@prisma/client";

export async function ensureWelcomeTemplate() {
  // Protect admin function
  await protectServerAction();

  try {
    const existingTemplate = await prisma.emailTemplate.findFirst({
      where: {
        name: "signedup",
      },
    });

    if (!existingTemplate) {
      const data: Prisma.EmailTemplateCreateInput = {
        name: "signedup",
        subject: "Welcome to Our Newsletter!",
        creator: "SYSTEM",
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
        `,
      };
      await prisma.emailTemplate.create({ data });
    }
  } catch (error) {
    console.error("Failed to ensure welcome template:", error);
  }
}

export async function ensureReturnTemplate() {
  // Protect admin function
  await protectServerAction();

  try {
    const existingTemplate = await prisma.emailTemplate.findFirst({
      where: {
        name: "return_request",
      },
    });

    if (!existingTemplate) {
      const data: Prisma.EmailTemplateCreateInput = {
        name: "return_request",
        subject: "Return Request - Order #{{order_number}}",
        creator: "SYSTEM",
        content: `
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
    <p>Hello {{customer_name}}, thank you for submitting your return request. We'll review it shortly and get back to you.</p>
  </div>

  <div class="section">
    <div class="section-title">Order Information</div>
    <p class="info-text"><span class="highlight">Customer Name:</span> {{customer_name}}</p>
    <p class="info-text"><span class="highlight">Order Number:</span> #{{order_number}}</p>
    <p class="info-text"><span class="highlight">Customer Email:</span> {{customer_email}}</p>
    <p class="info-text"><span class="highlight">Request Date:</span> {{request_date}}</p>
  </div>

  <div class="section">
    <div class="section-title">Items to Return</div>
    {{return_items}}
  </div>

  {{#if additional_notes}}
  <div class="section">
    <div class="section-title">Additional Notes</div>
    <p class="info-text">{{additional_notes}}</p>
  </div>
  {{/if}}

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
    <a href="mailto:{{support_email}}" class="button">Contact Support</a>
  </div>
</body>
</html>
        `,
      };
      await prisma.emailTemplate.create({ data });
    }
  } catch (error) {
    console.error("Failed to ensure return template:", error);
  }
}

export async function ensureReturnApprovedTemplate() {
  // Protect admin function
  await protectServerAction();

  try {
    const existingTemplate = await prisma.emailTemplate.findFirst({
      where: {
        name: "return_approved",
      },
    });
    console.log(existingTemplate);

    if (!existingTemplate) {
      const data: Prisma.EmailTemplateCreateInput = {
        name: "return_approved",
        subject: "Return Request Approved - Order #{{order_number}}",
        creator: "SYSTEM",
        content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Return Request Approved</title>
</head>
<body>
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #333; text-align: center;">Return Request Approved</h1>
    <p style="color: #666; line-height: 1.6;">
      Hello {{customer_name}}, great news! Your return request for order #{{order_number}} has been approved.
    </p>
    {{#if message}}
    <p style="color: #666; line-height: 1.6;">
      <strong>Message from our team:</strong> {{message}}
    </p>
    {{/if}}
    <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 4px;">
      <h2 style="color: #333; margin-top: 0;">Next Steps</h2>
      <ul style="color: #666; line-height: 1.6;">
        <li>Please package your items securely</li>
        <li>Include your order number: {{order_number}}</li>
        <li>Ship to our returns center</li>
        <li>Once received, we'll process your refund within 5-7 business days</li>
      </ul>
    </div>
    <p style="color: #666; line-height: 1.6;">
      If you have any questions, please contact our support team.
    </p>
    <div style="text-align: center; margin-top: 30px;">
      <a href="mailto:{{support_email}}" style="background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
        Contact Support
      </a>
    </div>
  </div>
</body>
</html>`,
      };
      await prisma.emailTemplate.create({ data });
    }
  } catch (error) {
    console.error("Failed to ensure return approved template:", error);
  }
}

export async function ensureReturnDeniedTemplate() {
  // Protect admin function
  await protectServerAction();

  try {
    const existingTemplate = await prisma.emailTemplate.findFirst({
      where: {
        name: "return_denied",
      },
    });

    if (!existingTemplate) {
      const data: Prisma.EmailTemplateCreateInput = {
        name: "return_denied",
        subject: "Return Request Update - Order #{{order_number}}",
        creator: "SYSTEM",
        content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Return Request Update</title>
</head>
<body>
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #333; text-align: center;">Return Request Update</h1>
    <p style="color: #666; line-height: 1.6;">
      Hello {{customer_name}}, we've reviewed your return request for order #{{order_number}}.
    </p>
    {{#if message}}
    <p style="color: #666; line-height: 1.6;">
      <strong>Message from our team:</strong> {{message}}
    </p>
    {{/if}}
    <p style="color: #666; line-height: 1.6;">
      Unfortunately, we are unable to accept your return request at this time. If you believe this decision was made in error or have additional information to provide, please don't hesitate to contact our support team.
    </p>
    <div style="text-align: center; margin-top: 30px;">
      <a href="mailto:{{support_email}}" style="background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
        Contact Support
      </a>
    </div>
  </div>
</body>
</html>`,
      };
      await prisma.emailTemplate.create({ data });
    }
  } catch (error) {
    console.error("Failed to ensure return denied template:", error);
  }
}

export async function createTemplate(
  name: string,
  subject: string,
  content: string
) {
  // Protect admin function
  await protectServerAction();

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
    console.error("Failed to create template:", error);
    throw new Error("Failed to create template");
  }
}

export async function getTemplates() {
  // Protect admin function
  await protectServerAction();

  try {
    const templates = await prisma.emailTemplate.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return templates;
  } catch (error) {
    console.error("Failed to fetch templates:", error);
    throw new Error("Failed to fetch templates");
  }
}

export async function deleteTemplate(id: string) {
  // Protect admin function
  await protectServerAction();

  try {
    // Check if template is a system template
    const template = await prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new Error("Template not found");
    }

    if (template.creator === "SYSTEM") {
      throw new Error("System templates cannot be deleted");
    }

    await prisma.emailTemplate.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to delete template:", error);
    throw error;
  }
}

export async function updateTemplate(
  id: string,
  name: string,
  subject: string,
  content: string
) {
  // Protect admin function
  await protectServerAction();

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
    console.error("Failed to update template:", error);
    throw new Error("Failed to update template");
  }
}

interface TemplateData {
  [key: string]: string | number | boolean | undefined;
}

export async function processTemplate(
  template: string,
  data: TemplateData
): Promise<string> {
  let processedTemplate = template;
  const processedData = { ...data };

  // Process order number if it's a Shopify URL
  if (
    processedData.order_number &&
    typeof processedData.order_number === "string"
  ) {
    const orderMatch = processedData.order_number.match(/Order\/(\d+)/);
    if (orderMatch) {
      processedData.order_number = orderMatch[1];
    }
  }

  // Replace simple placeholders
  Object.entries(processedData).forEach(([key, value]) => {
    const placeholder = new RegExp(`{{${key}}}`, "g");
    processedTemplate = processedTemplate.replace(placeholder, String(value));
  });

  // Process conditional blocks
  processedTemplate = processedTemplate.replace(
    /{{#if\s+([^}]+)}}([\s\S]*?){{\/if}}/g,
    (match, condition, content) => {
      return processedData[condition] ? content.trim() : "";
    }
  );

  return processedTemplate;
}

export async function getTemplateByName(name: string) {
  try {
    const template = await prisma.emailTemplate.findFirst({
      where: { name },
    });
    return template;
  } catch (error) {
    console.error("Failed to fetch template:", error);
    throw new Error("Failed to fetch template");
  }
}

export async function processTemplateFromDb(
  templateName: string,
  data: TemplateData
): Promise<{
  subject: string;
  html: string;
} | null> {
  try {
    const template = await prisma.emailTemplate.findFirst({
      where: { name: templateName },
    });

    if (!template) {
      console.error(`Template "${templateName}" not found`);
      return null;
    }

    const processedSubject = await processTemplate(template.subject, data);
    const processedHtml = await processTemplate(template.content, data);

    return {
      subject: processedSubject,
      html: processedHtml,
    };
  } catch (error) {
    console.error("Failed to process template from database:", error);
    return null;
  }
}

export async function ensureDefaultTemplates() {
  try {
    await Promise.all([
      ensureWelcomeTemplate(),
      ensureReturnTemplate(),
      ensureReturnApprovedTemplate(),
      ensureReturnDeniedTemplate(),
    ]);
  } catch (error) {
    console.error("Failed to ensure default templates:", error);
  }
}

export async function getTemplatePreview(
  templateName: string,
  sampleData: TemplateData = {}
) {
  try {
    const template = await prisma.emailTemplate.findFirst({
      where: { name: templateName },
    });

    if (!template) {
      return null;
    }

    // Provide default sample data if not provided
    const defaultData = {
      customer_name: "John Doe",
      order_number: "12345",
      customer_email: "sample@example.com",
      request_date: new Date().toISOString().split("T")[0],
      message: "Sample message for preview",
      support_email: "support@example.com",
      return_items: `
        <div class="item">
          <p><span class="highlight">Product:</span> Sample Product</p>
          <p><span class="highlight">Variant:</span> Medium</p>
          <p><span class="highlight">Quantity:</span> 1</p>
          <p><span class="highlight">Reason:</span> Size too large</p>
        </div>
      `,
      ...sampleData,
    };

    const processedSubject = await processTemplate(
      template.subject,
      defaultData
    );
    const processedHtml = await processTemplate(template.content, defaultData);

    return {
      subject: processedSubject,
      html: processedHtml,
      originalTemplate: template,
    };
  } catch (error) {
    console.error("Failed to get template preview:", error);
    return null;
  }
}

export async function validateTemplate(
  content: string,
  subject: string
): Promise<{
  isValid: boolean;
  errors: string[];
}> {
  const errors: string[] = [];

  try {
    // Check for balanced handlebars
    const handlebarsPattern = /{{[^}]+}}/g;
    const matches = content.match(handlebarsPattern) || [];
    const openCount = matches.filter((m) => m.startsWith("{{#")).length;
    const closeCount = matches.filter((m) => m.includes("{{/")).length;

    if (openCount !== closeCount) {
      errors.push("Unbalanced conditional blocks found");
    }

    // Check for valid HTML structure
    if (!content.includes("<!DOCTYPE html>")) {
      errors.push("Missing DOCTYPE declaration");
    }
    if (!content.includes("<html>") || !content.includes("</html>")) {
      errors.push("Missing html tags");
    }
    if (!content.includes("<head>") || !content.includes("</head>")) {
      errors.push("Missing head tags");
    }
    if (!content.includes("<body>") || !content.includes("</body>")) {
      errors.push("Missing body tags");
    }

    // Validate subject line
    if (!subject.trim()) {
      errors.push("Subject line cannot be empty");
    }
    if (subject.length > 100) {
      errors.push("Subject line is too long (max 100 characters)");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  } catch (error) {
    console.error("Error validating template:", error);
    return {
      isValid: false,
      errors: ["Failed to validate template"],
    };
  }
}

"use server";
import nodemailer from "nodemailer";
import { prisma } from "@/app/lib/prisma/client";
import { Return, ReturnItem } from "@/app/lib/types/returns";
import { protectServerAction, sanitizeInput } from "@/app/lib/auth-utils";
import { ReturnStatus } from "@prisma/client";
import {
  ensureDefaultTemplates,
  getTemplateByName,
  processTemplateFromDb,
} from "./templates";

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper function to get first name
function getFirstName(fullName: string): string {
  return fullName.split(" ")[0] || fullName;
}

// Function to get existing returns for an order
export async function getOrderReturns(orderNumber: number) {
  try {
    const returns = await prisma.return.findMany({
      where: {
        orderNumber,
        status: {
          not: "REJECTED",
        },
      },
      include: {
        items: true,
      },
    });
    return returns;
  } catch (error: unknown) {
    console.error("Failed to fetch order returns:", error);
    throw new Error("Failed to fetch order returns");
  }
}

export async function sendReturnRequest(
  orderNumber: number,
  orderId: string,
  items: { name: string; variant: string; reason: string; quantity?: number }[],
  additionalNotes: string,
  customerEmail: string,
  customerId: string,
  customerName?: string,
  totalPaid?: number
) {
  try {
    // Check for existing returns
    const existingReturns = await getOrderReturns(orderNumber);

    // Use provided customer name or fallback, ensuring string type and getting first name
    const resolvedCustomerName: string = getFirstName(
      customerName ?? "Valued Customer"
    );

    // Create a map of already returned items and their quantities
    const returnedItems = new Map<string, number>();
    existingReturns.forEach((returnRecord: Return) => {
      returnRecord.items.forEach((item: ReturnItem) => {
        const key = `${item.productName}-${item.variant}`;
        returnedItems.set(key, (returnedItems.get(key) || 0) + item.quantity);
      });
    });

    // Validate that items aren't already returned
    for (const item of items) {
      const key = `${item.name}-${item.variant}`;
      const returnedQuantity = returnedItems.get(key) || 0;
      if (returnedQuantity > 0) {
        throw new Error(
          `Item "${item.name} (${item.variant})" has already been returned`
        );
      }
    }

    // Create return record in database with proper type
    const returnRecord = await prisma.return.create({
      data: {
        orderNumber,
        orderId,
        customerEmail,
        customerId,
        customerName: resolvedCustomerName,
        additionalNotes,
        totalPaid: totalPaid || 0,
        items: {
          create: items.map(
            (item: {
              name: string;
              variant: string;
              reason: string;
              quantity?: number;
            }) => ({
              productName: item.name,
              variant: item.variant,
              reason: item.reason,
              quantity: item.quantity || 1,
            })
          ),
        },
      },
      include: {
        items: true,
      },
    });

    // Ensure all templates exist
    await ensureDefaultTemplates();

    // Generate return items HTML
    const returnItemsHtml = returnRecord.items
      .map(
        (item: ReturnItem) => `
      <div class="item">
        <p><span class="highlight">Product:</span> ${item.productName}</p>
        <p><span class="highlight">Variant:</span> ${item.variant}</p>
        <p><span class="highlight">Quantity:</span> ${item.quantity}</p>
        <p><span class="highlight">Reason:</span> ${item.reason}</p>
      </div>
    `
      )
      .join("");

    // Process template with data
    const emailTemplate = await processTemplateFromDb("return_request", {
      customer_name: resolvedCustomerName,
      order_number: orderNumber,
      customer_email: customerEmail,
      request_date: new Date().toISOString().split("T")[0],
      return_items: returnItemsHtml,
      additional_notes: additionalNotes,
      support_email: process.env.SMTP_FROM,
      total_paid: totalPaid?.toFixed(2) || "0.00",
    });

    if (!emailTemplate) {
      throw new Error("Failed to process return request template");
    }

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_FROM,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    return { success: true, returnId: returnRecord.id };
  } catch (error: unknown) {
    console.error("Failed to send return request:", error);
    throw new Error("Failed to send return request");
  }
}

// Function to get all returns for admin dashboard
export async function getReturns(searchQuery?: string): Promise<Return[]> {
  try {
    // Protect admin function
    await protectServerAction();

    const whereClause = searchQuery
      ? {
          OR: [
            { orderId: searchQuery },
            { customerId: searchQuery },
            { status: searchQuery as ReturnStatus },
          ],
        }
      : {};

    const returns = await prisma.return.findMany({
      where: whereClause,
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return returns;
  } catch (error: unknown) {
    console.error("Failed to fetch returns:", error);
    throw new Error("Failed to fetch returns");
  }
}

// Function to update return status
export async function updateReturnStatus(
  returnId: string,
  status: Return["status"]
): Promise<Return> {
  try {
    // Protect admin function
    await protectServerAction();

    // Sanitize inputs
    const sanitizedReturnId = sanitizeInput(returnId);

    const updatedReturn = await prisma.return.update({
      where: {
        id: sanitizedReturnId,
      },
      data: {
        status,
      },
      include: {
        items: true,
      },
    });

    return updatedReturn;
  } catch (error: unknown) {
    console.error("Failed to update return status:", error);
    throw new Error("Failed to update return status");
  }
}

// Function to get customer refunds
export async function getCustomerRefunds(customerId: string) {
  try {
    const returns = await prisma.return.findMany({
      where: {
        customerId: customerId,
        status: "APPROVED", // Only count approved returns
      },
      include: {
        items: true,
      },
    });

    // Calculate total items returned
    const totalItems = returns.reduce((sum: number, returnRecord: Return) => {
      return (
        sum +
        returnRecord.items.reduce(
          (itemSum: number, item: ReturnItem) => itemSum + item.quantity,
          0
        )
      );
    }, 0);

    return {
      totalRefunds: returns.length,
      totalItemsReturned: totalItems,
    };
  } catch (error) {
    console.error("Failed to fetch customer refunds:", error);
    return {
      totalRefunds: 0,
      totalItemsReturned: 0,
    };
  }
}

// Function to handle return approval/denial with email notification
export async function handleReturnAction(
  returnId: string,
  action: "confirm" | "deny",
  emailTo: string,
  message: string,
  customerName?: string
) {
  try {
    // Protect admin function
    await protectServerAction();

    // Get return record first to access customer info and items
    const returnRecord = await prisma.return.findUnique({
      where: { id: sanitizeInput(returnId) },
      include: {
        items: true, // Include items to generate return_items HTML
      },
    });

    if (!returnRecord) {
      throw new Error("Return record not found");
    }

    // Use provided customer name or fallback, ensuring string type and getting first name
    const resolvedCustomerName: string = getFirstName(
      customerName ?? "Valued Customer"
    );

    // Generate return items HTML
    const returnItemsHtml = returnRecord.items
      .map(
        (item) => `
      <div class="item">
        <p><span class="highlight">Product:</span> ${item.productName}</p>
        <p><span class="highlight">Variant:</span> ${item.variant}</p>
        <p><span class="highlight">Quantity:</span> ${item.quantity}</p>
        <p><span class="highlight">Reason:</span> ${item.reason}</p>
      </div>
    `
      )
      .join("");

    // Sanitize inputs
    const sanitizedReturnId = sanitizeInput(returnId);
    const sanitizedEmail = sanitizeInput(emailTo);
    const sanitizedMessage = sanitizeInput(message);
    const sanitizedCustomerName = sanitizeInput(resolvedCustomerName);

    // Determine new status and template name
    const newStatus: Return["status"] =
      action === "confirm" ? "APPROVED" : "REJECTED";
    const templateName =
      action === "confirm" ? "return_approved" : "return_denied";

    // Check if template exists
    let template = await getTemplateByName(templateName);

    // If template doesn't exist, create it
    if (!template) {
      await ensureDefaultTemplates();
      template = await getTemplateByName(templateName);
      if (!template) {
        throw new Error("Failed to create template");
      }
    }

    // Update return status
    const updatedReturn = await prisma.return.update({
      where: {
        id: sanitizedReturnId,
      },
      data: {
        status: newStatus,
      },
      include: {
        items: true,
      },
    });

    // Process template with data
    const templateData = {
      customer_name: sanitizedCustomerName,
      order_number: updatedReturn.orderNumber,
      customer_email: updatedReturn.customerEmail,
      message: sanitizedMessage,
      support_email: process.env.SMTP_FROM,
      return_items: returnItemsHtml,
      request_date: updatedReturn.createdAt.toISOString().split("T")[0],
      today_date: new Date().toISOString().split("T")[0],
      total_paid: updatedReturn.totalPaid.toFixed(2),
    };

    const emailTemplate = await processTemplateFromDb(
      templateName,
      templateData
    );

    if (!emailTemplate) {
      throw new Error("Failed to process template");
    }

    // Send email notification
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: sanitizedEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    return updatedReturn;
  } catch (error: unknown) {
    console.error("Failed to handle return action:", error);
    throw new Error("Failed to handle return action");
  }
}

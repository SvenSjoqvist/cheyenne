"use server";

import { processTemplateFromDb } from "./templates";
import { sendEmail } from "./email";
import { cancelOrder as shopifyCancelOrder } from "@/app/lib/shopify";

export async function handleOrderCancellation(
  orderId: string,
  orderNumber: number,
  customerName: string,
  customerEmail: string,
  items: Array<{
    title: string;
    variant: string;
    quantity: number;
    price: number;
  }>,
  totalPaid: number
) {
  try {
    console.log("Starting order cancellation with email:", customerEmail);

    // First cancel the order in Shopify
    const result = await shopifyCancelOrder(orderId, orderNumber);

    if (!result.success) {
      throw new Error(result.error || "Failed to cancel order in Shopify");
    }

    // Format items for email template
    const formattedItems = items
      .map(
        (item) => `
      <div class="item">
        <p><span class="highlight">Product:</span> ${item.title}</p>
        <p><span class="highlight">Variant:</span> ${item.variant}</p>
        <p><span class="highlight">Quantity:</span> ${item.quantity}</p>
        <p><span class="highlight">Price:</span> ${item.price.toFixed(2)}</p>
      </div>
    `
      )
      .join("");

    console.log("Processing email template for:", customerEmail);

    // Process the cancellation email template
    const emailResult = await processTemplateFromDb("order_cancelled", {
      customer_name: customerName,
      order_number: orderNumber,
      customer_email: customerEmail,
      request_date: new Date().toISOString().split("T")[0],
      today_date: new Date().toISOString().split("T")[0],
      return_items: formattedItems,
      total_paid: totalPaid.toFixed(2),
      support_email: process.env.SUPPORT_EMAIL || "support@example.com",
    });

    if (!emailResult) {
      throw new Error("Failed to process cancellation email template");
    }

    console.log("Sending email to:", customerEmail);
    console.log("Email content:", {
      to: customerEmail,
      subject: emailResult.subject,
      htmlLength: emailResult.html.length,
    });

    // Send the cancellation confirmation email
    await sendEmail({
      to: customerEmail,
      subject: emailResult.subject,
      html: emailResult.html,
    });

    console.log("Email sent successfully to:", customerEmail);
    return { success: true };
  } catch (error) {
    console.error("Error handling order cancellation:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to handle order cancellation",
    };
  }
}

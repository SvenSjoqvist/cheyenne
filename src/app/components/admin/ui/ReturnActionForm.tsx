"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleReturnAction } from "@/app/lib/actions/returns";

interface ReturnActionFormProps {
  returnId: string;
  customerEmail: string;
  customerName: string | null;
}

export default function ReturnActionForm({
  returnId,
  customerEmail,
  customerName,
}: ReturnActionFormProps) {
  const router = useRouter();
  const [action, setAction] = useState<"confirm" | "deny" | null>(null);
  const [emailTo, setEmailTo] = useState(customerEmail);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!action) {
      setFeedback({
        type: "error",
        message: "Please select either Confirm or Deny",
      });
      return;
    }

    if (!emailTo.trim()) {
      setFeedback({ type: "error", message: "Please enter an email address" });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      // The server action now throws errors instead of returning success/error objects
      await handleReturnAction(
        returnId,
        action,
        emailTo,
        message,
        customerName ?? undefined
      );

      // If we get here, the action was successful
      setFeedback({
        type: "success",
        message: `Return ${
          action === "confirm" ? "approved" : "denied"
        } successfully and email sent to ${emailTo}`,
      });

      // Reset form
      setAction(null);
      setMessage("");

      // Refresh the page to show updated status
      setTimeout(() => {
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error("Error submitting action:", error);
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Error submitting action. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 mb-8">
      <h3 className="font-semibold font-darker-grotesque text-[26px] tracking-wider mb-6">
        Return Action
      </h3>

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`mb-4 p-4 rounded-md ${
            feedback.type === "success"
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Action Checkboxes */}
        <div className="flex flex-row gap-10">
          <div className="flex gap-2 flex-col">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="confirm"
                checked={action === "confirm"}
                onChange={() => setAction("confirm")}
                className="w-4 h-4 text-white bg-black border-black rounded focus:ring-black focus:ring-2 checked:bg-black checked:border-black"
              />
              <label
                htmlFor="confirm"
                className="ml-2 text-sm font-medium text-gray-900"
              >
                Confirm
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="deny"
                checked={action === "deny"}
                onChange={() => setAction("deny")}
                className="w-4 h-4 text-white bg-black border-black rounded focus:ring-black focus:ring-2 checked:bg-black checked:border-black"
              />
              <label
                htmlFor="deny"
                className="ml-2 text-sm font-medium text-gray-900"
              >
                Deny
              </label>
            </div>
          </div>

          {/* Email Input */}
          <div className="flex gap-6 w-full">
            <div className="flex-1">
              <label
                htmlFor="emailTo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email To
              </label>
              <input
                type="email"
                id="emailTo"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                className="w-full p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          {/* Message Textarea */}
          <div className="w-full">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your message to the customer..."
            />
          </div>
          {/* Submit Button */}
          <div></div>
        </div>
        <div className="flex justify-center items-center">
          <button
            type="submit"
            disabled={isSubmitting || !action}
            className="px-6 py-3 bg-black text-white cursor-pointer rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-darker-grotesque"
          >
            {isSubmitting ? "Processing..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

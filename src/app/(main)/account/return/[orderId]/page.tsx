"use client";
import { useUser } from "@/app/components/client/account/AccountContext";
import { Order } from "@/app/components/client/account/AccountContext";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { sendReturnRequest, getOrderReturns } from "@/app/lib/actions/returns";

// Add type for edge nodes
type LineItemEdge = {
  node: {
    id: string;
    title: string;
    quantity: number;
    variant: {
      title: string;
      image: {
        url: string;
      } | null;
    } | null;
  };
};

const RETURN_REASONS = [
  "Wrong size",
  "Quality issue",
  "Not as described",
  "Damaged during shipping",
  "Changed my mind",
  "Other",
];

export default function RefundPage() {
  const { orderId } = useParams();
  const { orders, user, customer } = useUser();

  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isReturnsLoading, setIsReturnsLoading] = useState(true);
  const [order, setOrder] = useState<Order | undefined>(undefined);

  // Initialize order when orders array is available
  useEffect(() => {
    if (orders && orders.length > 0) {
      const foundOrder = orders.find((o) => o.orderNumber === Number(orderId));
      setOrder(foundOrder);
      setIsPageLoading(false);
    }
  }, [orders, orderId]);

  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [returnReasons, setReturnReasons] = useState<{ [key: string]: string }>(
    {}
  );
  const [returnQuantities, setReturnQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [returnedItems, setReturnedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchExistingReturns = async () => {
      if (!order) return;

      try {
        const existingReturns = await getOrderReturns(order.orderNumber);
        const returned = new Set<string>();

        existingReturns.forEach((returnRecord) => {
          returnRecord.items.forEach((item) => {
            returned.add(`${item.productName}-${item.variant}`);
          });
        });

        setReturnedItems(returned);
      } catch (error) {
        console.error("Error fetching existing returns:", error);
      } finally {
        setIsReturnsLoading(false);
      }
    };

    fetchExistingReturns();
  }, [order]);

  // Show loading state while either orders or returns are loading
  if (isPageLoading || isReturnsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  // Show error state if order is not found after loading
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-xl">Order not found</p>
        <button
          onClick={() => router.push("/account")}
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Return to Account
        </button>
      </div>
    );
  }

  const handleItemSelect = (itemId: string, variant: string) => {
    const uniqueId = `${itemId}-${variant}`;
    setSelectedItems((prev) => ({
      ...prev,
      [uniqueId]: !prev[uniqueId],
    }));
  };

  const handleReasonChange = (
    itemId: string,
    variant: string,
    reason: string
  ) => {
    const uniqueId = `${itemId}-${variant}`;
    setReturnReasons((prev) => ({
      ...prev,
      [uniqueId]: reason,
    }));
  };

  const handleQuantityChange = (
    itemId: string,
    variant: string,
    quantity: number
  ) => {
    const uniqueId = `${itemId}-${variant}`;
    setReturnQuantities((prev) => ({
      ...prev,
      [uniqueId]: quantity,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get selected items with their reasons and quantities
    const returnItems = Object.entries(selectedItems)
      .filter(([, selected]) => selected)
      .map(([uniqueId]) => {
        const [itemId, variant] = uniqueId.split("-");
        return {
          itemId,
          variant,
          reason: returnReasons[uniqueId] || "Not specified",
          quantity: returnQuantities[uniqueId] || 1,
        };
      });

    if (returnItems.length === 0) {
      alert("Please select at least one item to return");
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare items for email
      const items = returnItems.map((item) => {
        const lineItem = order.lineItems.edges.find(
          (edge: LineItemEdge) => edge.node.title === item.itemId
        );
        if (!lineItem?.node.title || !lineItem?.node.variant?.title) {
          throw new Error("Invalid item data");
        }
        return {
          name: lineItem.node.title,
          variant: lineItem.node.variant.title,
          reason: item.reason,
          quantity: item.quantity,
        };
      });

      // Get customer email from user context
      const customerEmail = user?.email || order.customer?.email;
      if (!customerEmail) {
        throw new Error("Customer email not found");
      }

      // Get customer ID from user context
      const customerId = user?.id;
      if (!customerId) {
        throw new Error("Customer ID not found");
      }

      // Get full customer name (first name + last name)
      const fullCustomerName = customer?.firstName && customer?.lastName 
        ? `${customer.firstName} ${customer.lastName}`
        : customer?.firstName || customer?.lastName || undefined;

      // Calculate total amount for returned items only
      const totalAmount = items.reduce((total, item) => {
        const lineItem = order.lineItems.edges.find(
          (edge: LineItemEdge) => edge.node.title === item.name
        );
        // Get the quantity from the current return item
        const returnQuantity = item.quantity || 1;

        // Calculate the unit price from the order total and original quantity
        const unitPrice = lineItem
          ? parseFloat(order.totalPrice.amount) /
            order.lineItems.edges.reduce(
              (sum: number, edge: LineItemEdge) => sum + edge.node.quantity,
              0
            )
          : 0;

        return total + unitPrice * returnQuantity;
      }, 0);

      // Send return request using server action with full customer name
      await sendReturnRequest(
        order.orderNumber,
        order.id,
        items,
        additionalNotes,
        customerEmail,
        customerId,
        fullCustomerName,
        totalAmount // Pass the calculated total for returned items only
      );

      alert(
        "Return request submitted successfully. We will review your request and get back to you soon."
      );
      router.push("/account");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(
          "Failed to submit return request. Please try again or contact customer support."
        );
      }
      console.error("Error submitting return request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20 bg-[#F7F7F7] min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col gap-4 justify-center items-center mb-10">
          <h1 className="text-[40px] font-[bero]">Returns</h1>
          <p className="font-[16px] font-darker-grotesque w-2/4 text-center">
            Before submitting your return request, please note that Kilaeko
            operates on a limited-inventory business model. Once items are sold
            out, they are not restocked. Each return submission will be
            thoroughly evaluated by our team, and approval is not guaranteed.
            Please ensure you provide all required information below to help us
            process your request.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h2 className="text-[32px] font-darker-grotesque font-medium mb-6">
              Select Items to Return
            </h2>
            <div className="space-y-6">
              {order.lineItems.edges.map((item: LineItemEdge) => {
                const variant = item.node.variant?.title || "";
                const uniqueId = `${item.node.title}-${variant}`;
                const isReturned = returnedItems.has(uniqueId);
                return (
                  <div
                    key={uniqueId}
                    className="flex items-start gap-6 p-4 bg-white rounded-lg shadow-sm"
                  >
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        id={`item-${uniqueId}`}
                        checked={selectedItems[uniqueId] || false}
                        onChange={() =>
                          handleItemSelect(item.node.title, variant)
                        }
                        disabled={isReturned}
                        className="w-5 h-5 mt-2"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-start gap-4">
                        {item.node.variant?.image?.url && (
                          <div className="relative w-20 h-20">
                            <Image
                              src={item.node.variant.image.url}
                              alt={item.node.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium">{item.node.title}</h3>
                          <p className="text-sm text-gray-600">
                            {item.node.variant?.title}
                          </p>
                          {isReturned && (
                            <p className="text-sm text-red-600 mt-2">
                              This item has already been returned
                            </p>
                          )}
                          {selectedItems[uniqueId] && !isReturned && (
                            <div className="mt-4 space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Reason for Return
                                </label>
                                <select
                                  value={returnReasons[uniqueId] || ""}
                                  onChange={(e) =>
                                    handleReasonChange(
                                      item.node.title,
                                      variant,
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                  required
                                >
                                  <option value="">Select a reason</option>
                                  {RETURN_REASONS.map((reason) => (
                                    <option key={reason} value={reason}>
                                      {reason}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Quantity to Return
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max={item.node.quantity || 1}
                                  value={returnQuantities[uniqueId] || 1}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.node.title,
                                      variant,
                                      parseInt(e.target.value)
                                    )
                                  }
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                  required
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              rows={4}
              placeholder="Please provide any additional information about your return request..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Return Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

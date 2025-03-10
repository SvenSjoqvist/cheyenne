// components/account/OrderHistory.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Order } from "@/app/components/account/AccountContext";

export default function OrderHistory({ orders }: { orders: Order[] }) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const formatCurrency = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-10 flex flex-2 flex-col py-10 w-full h-full">
        <h1 className="text-2xl font-bold mb-6 font-[bero]">Order History</h1>
        <div className="text-center py-8">
          <p className="mb-4 font-[bero]">You don't have any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 flex flex-2 flex-col py-20 w-full h-full">
      <h1 className="text-3xl font-bold mb-6 font-[bero]">Order History</h1>

      <div className="space-y-4 w-2/3">
        {orders.map((order) => (
          <div key={order.id} className="border rounded overflow-hidden">
            <div
              className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
              onClick={() => toggleOrderDetails(order.id)}
            >
              <div>
                <p className="font-semibold">Order #{order.orderNumber}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.processedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {formatCurrency(
                    order.totalPrice.amount,
                    order.totalPrice.currencyCode
                  )}
                </p>
                <p
                  className={`text-sm ${
                    order.fulfillmentStatus === "FULFILLED"
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {order.fulfillmentStatus}
                </p>
              </div>
            </div>

            {expandedOrder === order.id && (
              <div className="p-4 border-t">
                <h3 className="font-semibold mb-2">Items</h3>
                <div className="space-y-3">
                  {order.lineItems.edges.map((edge, index) => (
                    <div key={index} className="flex items-center">
                      {edge.node.variant?.image?.url && (
                        <div className="w-16 h-16 mr-4 relative">
                          <Image
                            src={edge.node.variant.image.url}
                            alt={edge.node.title}
                            fill
                            sizes="64px"
                            style={{ objectFit: "cover" }}
                            className="rounded"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{edge.node.title}</p>
                        {edge.node.variant?.title !== "Default Title" && (
                          <p className="text-sm text-gray-600">
                            {edge.node.variant?.title}
                          </p>
                        )}
                        <p className="text-sm">
                          Quantity: {edge.node.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

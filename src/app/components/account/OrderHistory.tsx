"use client";

import { useState } from "react";
import Image from "next/image";
import { Order } from "@/app/components/account/AccountContext";
import React from "react";
import { cancelOrder } from "@/app/lib/shopify";
import { useRouter } from "next/navigation";

export default function OrderHistory({ orders }: { orders: Order[] }) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const router = useRouter();
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOrderEditable = (order: Order) => {
    const nonEditableStatuses = ["FULFILLED", "PARTIALLY_FULFILLED", "SHIPPED"];
    
    return (
      !nonEditableStatuses.includes(order.fulfillmentStatus) && 
      order.financialStatus !== "REFUNDED"
    );
  };

  const handleEditOrder = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setEditingOrder(orderId);
    setExpandedOrder(orderId);
  };

  const handleCancelOrder = async (orderId: string, orderNumber: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (cancelingOrderId !== orderId) {
      setCancelingOrderId(orderId);
      return;
    }
      try {
      setIsCanceling(true);      
      const result = await cancelOrder(orderId, orderNumber);
      
      if (result.success) {
        alert(`Order #${orderId} has been cancelled successfully.`);
        window.location.reload();
      } else {
        alert(`Failed to cancel order: ${result.error}`);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order. Please try again or contact customer support.");
    } finally {
      setIsCanceling(false);
      setCancelingOrderId(null);
    }
  };

  const handleUpdateQuantity = (orderId: string, lineItemId: string, newQuantity: number) => {
    // Implementation remains the same
    console.log(orderId, lineItemId, newQuantity);
  };

  const handleRemoveItem = (orderId: string, lineItemId: string) => {
    // Implementation remains the same
    console.log(orderId, lineItemId);
  };

  const handleSaveChanges = (orderId: string) => {
    // Implementation remains the same
    console.log(orderId);
    setEditingOrder(null);
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
    setCancelingOrderId(null);
  };

  if (orders.length === 0) {
    return (
      <div className='p-10 flex flex-2 flex-col py-20 w-full h-full'>
        <h1 className="text-3xl font-bold mb-2 font-[bero]">Order History</h1>
        <div className="text-left">
        <p className="mb-4 font-[bero]">You don&apos;t have any orders yet.</p>        </div>
      </div>
    );
  }

  return (
    <div className="p-10 flex flex-2 flex-col py-20 w-full h-full">
      <h1 className="text-3xl font-bold mb-6 font-[bero]">Order History</h1>
      
      <div className="overflow-x-auto w-full">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left font-semibold">Order</th>
              <th className="border border-gray-300 p-3 text-left font-semibold">Date</th>
              <th className="border border-gray-300 p-3 text-left font-semibold">Payment Status</th>
              <th className="border border-gray-300 p-3 text-left font-semibold">Fulfillment Status</th>
              <th className="border border-gray-300 p-3 text-left font-semibold">Total</th>
              <th className="border border-gray-300 p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  <td className="border border-gray-300 p-3 font-medium">{order.orderNumber}</td>
                  <td className="border border-gray-300 p-3">{formatDate(order.processedAt)}</td>
                  <td className="border border-gray-300 p-3">
                    <span className={`px-2 py-1 text-xs ${
                      order.financialStatus === "PAID" 
                        ? "text-green-800" 
                        : "text-yellow-800"
                    }`}>
                      {order.financialStatus}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-3">
                    <span className={`px-2 py-1 text-xs ${
                      order.fulfillmentStatus === "FULFILLED" 
                        ? "text-green-800" 
                        : "text-orange-800"
                    }`}>
                      {order.fulfillmentStatus}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-3 font-medium">
                    {formatCurrency(order.totalPrice.amount, order.totalPrice.currencyCode)}
                  </td>
                  <td className="border border-gray-300 p-3">
                    <div className="flex flex-col space-y-1">
                      <button className="text-xs text-blue-600 hover:underline cursor-pointer" onClick={() => router.push(`/account/return/${order.orderNumber}`)}>Request Return</button>
                      {isOrderEditable(order) && (
                        <>
                          <button 
                            className="text-xs text-blue-600 hover:underline cursor-pointer" 
                            onClick={(e) => handleEditOrder(order.id, e)}
                          >
                            Edit Order
                          </button>
                          <button 
                            className="text-xs text-red-600 hover:underline cursor-pointer" 
                            onClick={(e) => handleCancelOrder(order.id, order.orderNumber, e)}
                            disabled={isCanceling}
                          >
                            {cancelingOrderId === order.id ? "Confirm Cancel" : "Cancel Order"}
                          </button>
                        </>
                      )}
                      <button className="text-xs text-blue-600 hover:underline cursor-pointer">Reorder</button>
                    </div>
                  </td>
                </tr>
                {expandedOrder === order.id && (
                  <tr>
                    <td colSpan={6} className="border border-gray-300 p-0">
                      <div className="p-4 bg-gray-50">
                        <h3 className="font-semibold mb-2">Items</h3>
                        <div className="grid gap-4">
                          {order.lineItems.edges.map((edge, index) => (
                            <div key={`item-${order.id}-${index}`} className="flex items-center border-b border-gray-200 pb-2">
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
                              <div className="flex-grow">
                                <p className="font-medium">{edge.node.title}</p>
                                {edge.node.variant?.title !== "Default Title" && (
                                  <p className="text-sm text-gray-600">
                                    {edge.node.variant?.title}
                                  </p>
                                )}
                                <div className="flex items-center mt-1">
                                  {editingOrder === order.id ? (
                                    <>
                                      <label className="text-sm mr-2">Quantity:</label>
                                      <input 
                                        type="number" 
                                        min="0" 
                                        defaultValue={edge.node.quantity}
                                        className="w-16 p-1 border border-gray-300 rounded"
                                        onChange={(e) => handleUpdateQuantity(
                                          order.id, 
                                          `${index}`, // Using index as a placeholder for lineItemId
                                          parseInt(e.target.value)
                                        )}
                                      />
                                      <button 
                                        className="ml-4 text-xs text-red-600 hover:underline"
                                        onClick={() => handleRemoveItem(
                                          order.id, 
                                          `${index}` // Using index as a placeholder for lineItemId
                                        )}
                                      >
                                        Remove
                                      </button>
                                    </>
                                  ) : (
                                    <p className="text-sm">
                                      Quantity: {edge.node.quantity}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {editingOrder === order.id && (
                          <div className="mt-4 flex justify-end space-x-3">
                            <button 
                              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                            <button 
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                              onClick={() => handleSaveChanges(order.id)}
                            >
                              Save Changes
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
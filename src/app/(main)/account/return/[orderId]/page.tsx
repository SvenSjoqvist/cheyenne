"use client";
import { useUser } from "@/app/components/client/account/AccountContext";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { sendReturnRequest } from "@/app/lib/actions/returns";

const RETURN_REASONS = [
  "Wrong size",
  "Quality issue",
  "Not as described",
  "Damaged during shipping",
  "Changed my mind",
  "Other"
];

export default function RefundPage() {
    const { orderId } = useParams();
    const { orders } = useUser();
    const router = useRouter();
    const order = orders.find((order) => order.orderNumber === Number(orderId));
    
    const [selectedItems, setSelectedItems] = useState<{[key: string]: boolean}>({});
    const [returnReasons, setReturnReasons] = useState<{[key: string]: string}>({});
    const [additionalNotes, setAdditionalNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!order) {
        return <div>Order not found</div>;
    }

    const handleItemSelect = (itemId: string) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleReasonChange = (itemId: string, reason: string) => {
        setReturnReasons(prev => ({
            ...prev,
            [itemId]: reason
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Get selected items with their reasons
        const returnItems = Object.entries(selectedItems)
            .filter(([, selected]) => selected)
            .map(([itemId]) => ({
                itemId,
                reason: returnReasons[itemId] || "Not specified"
            }));

        if (returnItems.length === 0) {
            alert("Please select at least one item to return");
            setIsSubmitting(false);
            return;
        }

        try {
            // Prepare items for email
            const items = returnItems.map(item => {
                const lineItem = order.lineItems.edges.find(
                    edge => edge.node.title === item.itemId
                );
                if (!lineItem?.node.title || !lineItem?.node.variant?.title) {
                    throw new Error("Invalid item data");
                }
                return {
                    name: lineItem.node.title,
                    variant: lineItem.node.variant.title,
                    reason: item.reason
                };
            });

            // Send return request using server action
            await sendReturnRequest(
                order.orderNumber,
                items,
                additionalNotes,
                order.customer?.email || "Not provided"
            );

            alert("Return request submitted successfully. We will review your request and get back to you soon.");
            router.push('/account');
        } catch (error) {
            alert("Failed to submit return request. Please try again or contact customer support.");
            console.error('Error submitting return request:', error);
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
                        Before submitting your return request, please note that Kilaeko operates on a limited-inventory business model. Once items are sold out, they are not restocked. Each return submission will be thoroughly evaluated by our team, and approval is not guaranteed. Please ensure you provide all required information below to help us process your request.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <h2 className="text-[32px] font-darker-grotesque font-medium mb-6">Select Items to Return</h2>
                        <div className="space-y-6">
                            {order.lineItems.edges.map((item) => (
                                <div key={item.node.title} className="flex items-start gap-6 p-4 bg-white rounded-lg shadow-sm">
                                    <div className="flex-shrink-0">
                                        <input
                                            type="checkbox"
                                            id={`item-${item.node.title}`}
                                            checked={selectedItems[item.node.title] || false}
                                            onChange={() => handleItemSelect(item.node.title)}
                                            className="w-5 h-5 mt-2"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex gap-6">
                                            <div className="w-32 h-32 relative">
                                                <Image 
                                                    src={item.node.variant?.image?.url || '/images/placeholder.png'} 
                                                    alt={item.node.title || 'Product image'}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="font-medium text-lg">{item.node.title}</h3>
                                                <p className="text-gray-600">{item.node.variant?.title}</p>
                                                
                                                {selectedItems[item.node.title] && (
                                                    <div className="mt-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Reason for Return
                                                        </label>
                                                        <select
                                                            value={returnReasons[item.node.title] || ""}
                                                            onChange={(e) => handleReasonChange(item.node.title, e.target.value)}
                                                            className="w-full p-2 border border-gray-300 rounded-md"
                                                            required
                                                        >
                                                            <option value="">Select a reason</option>
                                                            {RETURN_REASONS.map(reason => (
                                                                <option key={reason} value={reason}>
                                                                    {reason}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
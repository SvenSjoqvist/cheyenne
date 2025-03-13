"use client";
import { useUser } from "@/app/components/account/AccountContext";
import { useParams } from "next/navigation";

export default function RefundPage() {
    const { orderId } = useParams();
    const { orders } = useUser();
    const order = orders.find((order) => order.orderNumber === Number(orderId));

    return (
        <div className="pt-20 bg-[#F7F7F7]">
            <div className="flex flex-col gap-4 justify-center items-center mb-10">
                <h1 className="text-[40px] font-[bero]">Returns</h1>
                <p className="font-[16px] font-darker-grotesque w-2/4 text-center">
                    Before submitting your return request, please note that Kilaeko operates on a limited-inventory business model. Once items are sold out, they are not restocked. Each return submission will be thoroughly evaluated by our team, and approval is not guaranteed. Please ensure you provide all required information below to help us process your request. For more information, look at our return policy here.
                </p>
            </div>
            <div>
                <h1 className="text-[32px] font-darker-grotesque font-medium ml-10">Please select item(s) to return</h1>
                <div className="flex flex-col gap-4">
                    {order?.lineItems.edges.map((item) => (
                        <div key={item.node.title} className="flex items-center mb-4">
                            <div className="flex flex-row gap-4">
                                <div className="w-40 h-40 ml-4">
                                    <img src={item.node.variant?.image?.url} className="w-full h-full object-contain " />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <span className="font-medium">{item.node.title}</span>
                                    <span className="font-medium">{item.node.variant?.title}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <span className="font-medium">{order?.totalPrice.amount}</span>
                </div>
            </div>
        </div>
    )
}
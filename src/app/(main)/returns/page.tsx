import React from 'react';

export default function ReturnPolicy() {
  return (
    <div className="bg-neutral-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto px-8 lg:px-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold font-[bero] tracking-widest text-neutral-800 mb-8 text-center">
            Return & Cancellation Policy
          </h1>
        </div>

        {/* Returns Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-darker-grotesque text-neutral-800 mb-6 text-center">
            Returns
          </h2>
          <div className="space-y-12">
            <div className="mb-8">
              <h3 className="text-xl font-bold font-darker-grotesque text-neutral-800 mb-4 text-center">
                Return Conditions
              </h3>
              <p className="text-lg font-darker-grotesque text-neutral-700 text-center line-clamp-4">
                We accept returns only in cases of company error, such as shipping the incorrect item. The item must be returned in perfect, unworn condition with all original tags attached. We do not accept returns or exchanges due to ordering the wrong size, as our sizing guides and customer support team are available prior to purchase to assist with selecting the correct size.
              </p>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold font-darker-grotesque text-neutral-800 mb-4 text-center">
                Return Process
              </h3>
              <p className="text-lg font-darker-grotesque text-neutral-700 text-center line-clamp-4">
                To initiate a return, please contact Kilaeko Support and submit a ticket with your order number, reason for return, and preferred resolution (refund or store credit). Our team will review your request and, if approved, provide a return shipping label via email. You will have 14 days from receiving the return label to send back the item. Once we receive the returned item, we will inspect its condition. If the return is accepted, we will process your refund within 3-10 business days. If you selected store credit, it will be emailed to you.
              </p>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold font-darker-grotesque text-neutral-800 mb-4 text-center">
                Shipping Costs
              </h3>
              <p className="text-lg font-darker-grotesque text-neutral-700 text-center line-clamp-4">
                For approved returns, Kilaeko will cover the cost of return shipping. We will provide you with a prepaid shipping label.
              </p>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold font-darker-grotesque text-neutral-800 mb-4 text-center">
                Exchanges
              </h3>
              <p className="text-lg font-darker-grotesque text-neutral-700 text-center line-clamp-4">
                We do not offer exchanges during this time due to our limited product and drop system.
              </p>
            </div>
          </div>
        </div>

        {/* Cancellations Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-darker-grotesque text-neutral-800 mb-6 text-center">
            Order Cancellations
          </h2>
          <div className="space-y-12">
            <div className="mb-8">
              <h3 className="text-xl font-bold font-darker-grotesque text-neutral-800 mb-4 text-center">
                Cancellation Window
              </h3>
              <p className="text-lg font-darker-grotesque text-neutral-700 text-center line-clamp-4">
                You may cancel your order only during the &ldquo;Order Processing&rdquo; stage, before the order status changes to &ldquo;Shipped&rdquo;. Once an order has shipped, it can no longer be canceled.
              </p>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold font-darker-grotesque text-neutral-800 mb-4 text-center">
                Cancellation Fees
              </h3>
              <p className="text-lg font-darker-grotesque text-neutral-700 text-center line-clamp-4">
                There are no fees for canceling an order during the allowable window.
              </p>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold font-darker-grotesque text-neutral-800 mb-4 text-center">
                Pre-Order Cancellations
              </h3>
              <p className="text-lg font-darker-grotesque text-neutral-700 text-center line-clamp-4">
                Pre-orders cannot be canceled once placed, as we begin production based on pre-order quantities. Please ensure you are certain about the item and size before placing a pre order.
              </p>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold font-darker-grotesque text-neutral-800 mb-4 text-center">
                Refunds for Canceled Orders
              </h3>
              <p className="text-lg font-darker-grotesque text-neutral-700 text-center line-clamp-4">
                If you cancel your order during the allowed window, you will receive a full refund of the purchase price to your original payment method. Refunds will be processed within 3-10 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-16">
          <p className="text-lg font-darker-grotesque text-neutral-700 text-center">
            If you have any further questions about our Return & Cancellation policy, please contact{" "}
            <a href="mailto:info@kilaeko.com" className="text-blue-600 hover:underline">
              info@kilaeko.com
            </a>
            . We&apos;re happy to assist you.
          </p>
        </div>
      </div>
    </div>
  );
}
"use client";

import React from 'react';

type ReturnItem = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  returnId: string;
  productName: string;
  variant: string;
  reason: string;
  quantity: number;
};

type Return = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  orderId: string;
  orderNumber: number;
  customerId: string;
  customerEmail: string;
  customerName: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  additionalNotes: string | null;
  items: ReturnItem[];
};

interface ReturnCardsProps {
  returnRequest: Return;
}

export default function ReturnCards({ returnRequest }: ReturnCardsProps) {
  // Parse customer name into first and last name
  const parseCustomerName = (fullName: string | null) => {
    if (!fullName) return { firstName: 'N/A', lastName: 'N/A' };
    
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length === 1) {
      return { firstName: nameParts[0], lastName: 'N/A' };
    } else if (nameParts.length >= 2) {
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      return { firstName, lastName };
    }
    
    return { firstName: 'N/A', lastName: 'N/A' };
  };

  const { firstName, lastName } = parseCustomerName(returnRequest.customerName);

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full mb-8">
      <div className="flex-1 min-w-0">
        <div className="h-auto w-full rounded-2xl overflow-hidden border-2 border-[#E0E0E0]">
          <div className="p-4 border-b-2 border-[#E0E0E0]">
            <h3 className="text-black font-semibold font-darker-grotesque text-lg sm:text-xl lg:text-2xl tracking-wider">
              Customer Information
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-[#E0E0E0]">
                  <td className="text-black font-semibold font-darker-grotesque text-xs sm:text-sm lg:text-base py-2 sm:py-3 px-3 sm:px-4 md:px-6 border-r-2 border-[#E0E0E0] w-1/3 min-w-[120px] align-top">
                    <div className="break-words">First Name</div>
                  </td>
                  <td className="text-black text-xs sm:text-sm lg:text-base font-regular font-darker-grotesque py-2 sm:py-3 px-3 sm:px-4 md:px-6 w-2/3 align-top">
                    <div className="break-words">{firstName}</div>
                  </td>
                </tr>
                <tr className="border-b border-[#E0E0E0]">
                  <td className="text-black font-semibold font-darker-grotesque text-xs sm:text-sm lg:text-base py-2 sm:py-3 px-3 sm:px-4 md:px-6 border-r-2 border-[#E0E0E0] w-1/3 min-w-[120px] align-top">
                    <div className="break-words">Last Name</div>
                  </td>
                  <td className="text-black text-xs sm:text-sm lg:text-base font-regular font-darker-grotesque py-2 sm:py-3 px-3 sm:px-4 md:px-6 w-2/3 align-top">
                    <div className="break-words">{lastName}</div>
                  </td>
                </tr>
                <tr className="border-b border-[#E0E0E0]">
                  <td className="text-black font-semibold font-darker-grotesque text-xs sm:text-sm lg:text-base py-2 sm:py-3 px-3 sm:px-4 md:px-6 border-r-2 border-[#E0E0E0] w-1/3 min-w-[120px] align-top">
                    <div className="break-words">Email</div>
                  </td>
                  <td className="text-black text-xs sm:text-sm lg:text-base font-regular font-darker-grotesque py-2 sm:py-3 px-3 sm:px-4 md:px-6 w-2/3 align-top">
                    <div className="break-words">{returnRequest.customerEmail}</div>
                  </td>
                </tr>
                <tr className="border-b border-[#E0E0E0] last:border-b-0">
                  <td className="text-black font-semibold font-darker-grotesque text-xs sm:text-sm lg:text-base py-2 sm:py-3 px-3 sm:px-4 md:px-6 border-r-2 border-[#E0E0E0] w-1/3 min-w-[120px] align-top">
                    <div className="break-words">Phone</div>
                  </td>
                  <td className="text-black text-xs sm:text-sm lg:text-base font-regular font-darker-grotesque py-2 sm:py-3 px-3 sm:px-4 md:px-6 w-2/3 align-top">
                    <div className="break-words">N/A</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="h-auto w-full rounded-2xl overflow-hidden border-2 border-[#E0E0E0]">
          <div className="p-4 border-b-2 border-[#E0E0E0]">
            <h3 className="text-black font-semibold font-darker-grotesque text-lg sm:text-xl lg:text-2xl tracking-wider">
              Product Information
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {returnRequest.items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <tr className="border-b border-[#E0E0E0]">
                      <td className="text-black font-semibold font-darker-grotesque text-xs sm:text-sm lg:text-base py-2 sm:py-3 px-3 sm:px-4 md:px-6 border-r-2 border-[#E0E0E0] w-1/3 min-w-[120px] align-top">
                        <div className="break-words">Product Name</div>
                      </td>
                      <td className="text-black text-xs sm:text-sm lg:text-base font-regular font-darker-grotesque py-2 sm:py-3 px-3 sm:px-4 md:px-6 w-2/3 align-top">
                        <div className="break-words">{item.productName} {item.variant}</div>
                      </td>
                    </tr>
                    <tr className="border-b border-[#E0E0E0]">
                      <td className="text-black font-semibold font-darker-grotesque text-xs sm:text-sm lg:text-base py-2 sm:py-3 px-3 sm:px-4 md:px-6 border-r-2 border-[#E0E0E0] w-1/3 min-w-[120px] align-top">
                        <div className="break-words">Quantity</div>
                      </td>
                      <td className="text-black text-xs sm:text-sm lg:text-base font-regular font-darker-grotesque py-2 sm:py-3 px-3 sm:px-4 md:px-6 w-2/3 align-top">
                        <div className="break-words">{item.quantity}</div>
                      </td>
                    </tr>
                    <tr className="border-b border-[#E0E0E0]">
                      <td className="text-black font-semibold font-darker-grotesque text-xs sm:text-sm lg:text-base py-2 sm:py-3 px-3 sm:px-4 md:px-6 border-r-2 border-[#E0E0E0] w-1/3 min-w-[120px] align-top">
                        <div className="break-words">Reason</div>
                      </td>
                      <td className="text-black text-xs sm:text-sm lg:text-base font-regular font-darker-grotesque py-2 sm:py-3 px-3 sm:px-4 md:px-6 w-2/3 align-top">
                        <div className="break-words">{item.reason}</div>
                      </td>
                    </tr>
                    <tr className={`border-b border-[#E0E0E0] ${index === returnRequest.items.length - 1 ? 'last:border-b-0' : ''}`}>
                      <td className="text-black font-semibold font-darker-grotesque text-xs sm:text-sm lg:text-base py-2 sm:py-3 px-3 sm:px-4 md:px-6 border-r-2 border-[#E0E0E0] w-1/3 min-w-[120px] align-top">
                        <div className="break-words">More Info</div>
                      </td>
                      <td className="text-black text-xs sm:text-sm lg:text-base font-regular font-darker-grotesque py-2 sm:py-3 px-3 sm:px-4 md:px-6 w-2/3 align-top">
                        <div className="break-words">{returnRequest.additionalNotes || 'N/A'}</div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 
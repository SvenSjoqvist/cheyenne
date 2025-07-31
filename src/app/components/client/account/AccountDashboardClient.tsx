"use client";

import { useState } from "react";
import OrderHistory from "@/app/components/client/account/OrderHistory";
import AccountDetails from "@/app/components/client/account/AccountDetails"; 
import LogoutButton from "@/app/components/client/account/ui/LogoutButton";
import { Customer } from "@/app/lib/shopify/types";
import { Order } from "@/app/components/client/account/AccountContext";

type ActiveView = 'account' | 'history';

interface AccountDashboardClientProps {
  customer: Customer;
  orders: Order[];
}

export default function AccountDashboardClient({ customer, orders }: AccountDashboardClientProps) {
  const [activeView, setActiveView] = useState<ActiveView>('account');

  return (
    <div className="h-full w-full bg-[#F5F5F5]">
      {/* Mobile Navigation - Top tabs */}
      <div className="lg:hidden pt-20 px-4">
        <div className="flex bg-white rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveView('account')}
            className={`flex-1 py-3 px-4 text-center rounded-md font-medium font-darker-grotesque transition-colors ${
              activeView === 'account'
                ? 'bg-black text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            My Account
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`flex-1 py-3 px-4 text-center rounded-md font-medium font-darker-grotesque transition-colors ${
              activeView === 'history'
                ? 'bg-black text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Order History
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Desktop Sidebar */}
        <div className="w-[20%] min-h-screen bg-[#F5F5F5] pt-20">
          <nav className="px-14">
            <div className="space-y-2">
              <button
                onClick={() => setActiveView('account')}
                className={`w-full text-[26px] text-left px-5 font-medium font-darker-grotesque relative cursor-pointer ${
                  activeView === 'account'
                    ? 'before:content-[""] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0.5 before:h-7 before:bg-black'
                    : ''
                }`}
              >
                My Account
              </button>
              <button
                onClick={() => setActiveView('history')}
                className={`w-full text-[26px] text-left px-5 font-medium font-darker-grotesque relative cursor-pointer ${
                  activeView === 'history'
                    ? 'before:content-[""] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0.5 before:h-7 before:bg-black'
                    : ''
                }`}
              >
                Order History
              </button>
            </div>
          </nav>
        </div>

        {/* Desktop Main Content */}
        <div className="flex-1">
          {activeView === 'account' ? (
            <AccountDetails customer={customer} />
          ) : (
            <OrderHistory orders={orders} />
          )}
        </div>
      </div>

      {/* Mobile Main Content */}
      <div className="lg:hidden">
        {activeView === 'account' ? (
          <AccountDetails customer={customer} />
        ) : (
          <OrderHistory orders={orders} />
        )}
      </div>
      
      {/* Logout Button */}
      <div className="flex justify-center align-middle pb-10">
        <LogoutButton />
      </div>
    </div>
  );
} 
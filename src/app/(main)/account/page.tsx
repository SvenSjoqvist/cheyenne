// components/account/AccountDashboard.tsx
"use client";
import { useUser, Customer } from "@/app/components/account/AccountContext";
import OrderHistory from "@/app/components/account/OrderHistory";
import AccountDetails from "@/app/components/account/AccountDetails";

type Tab = "dashboard" | "orders" | "addresses" | "profile";

export default function AccountDashboard({
  initialCustomer,
}: {
  initialCustomer: Customer;
}) {
  const { customer, orders } = useUser();
  console.log(customer);

  // Use the context customer if available, otherwise use the initial customer
  const customerData = customer || initialCustomer;

  return (
    <div className="w-full h-full flex flex-row bg-[#F7F7F7]">
      <OrderHistory orders={orders} />
      <AccountDetails customer={customerData} />
    </div>
  );
}

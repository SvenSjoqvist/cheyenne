import { UserProvider } from "@/app/components/client/account/AccountContext";
import { getCustomer, getCustomerOrders } from "@/app/lib/shopify";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customerPromise = getCustomer();
  const ordersPromise = getCustomerOrders();

  return (
    <UserProvider customer={customerPromise} orders={ordersPromise}>
      {children}
    </UserProvider>
  );
} 
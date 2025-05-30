import { redirect } from "next/navigation";
import { Customer } from "@/app/components/client/account/AccountContext";
import OrderHistory from "@/app/components/client/account/OrderHistory";
import AccountDetails from "@/app/components/client/account/AccountDetails"; 
import LogoutButton from "@/app/components/client/account/ui/LogoutButton";
import { getCookies, getCustomerOrder, Customer as fetchCustomer } from "@/app/components/client/account/actions";

export default async function AccountDashboard() {
  // Check authentication server-side
  const token = await getCookies({ cookieName: 'customerAccessToken' });
  
  if (!token) {
    redirect('/');
  }
  
  // Fetch customer data server-side
  const customerData = await fetchCustomer();
  
  if (!customerData || !customerData.customer) {
    redirect('/');
  }
  
  // Fetch orders server-side
  const orderData = await getCustomerOrder();
  const orders = orderData?.orders || [];
  
  // Prepare customer object
  const customer: Customer = {
    id: customerData.customer?.id || "",
    firstName: customerData.customer?.firstName || "",
    lastName: customerData.customer?.lastName || "",
    email: customerData.customer?.email || "",
    phone: customerData.customer?.phone || "",
    displayName: customerData.customer?.displayName || 
      `${customerData.customer?.firstName || ""} ${customerData.customer?.lastName || ""}`
  };

  return (
    <div className="h-full w-full bg-[#F7F7F7]">
      <div className="flex flex-row">
        <OrderHistory orders={orders} />
        <AccountDetails customer={customer} />
      </div>
      <div className="flex justify-center align-middle pb-10">
        <LogoutButton />
      </div>
    </div>
  );
}

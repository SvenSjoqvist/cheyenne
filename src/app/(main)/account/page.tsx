import { redirect } from "next/navigation";
import AccountDashboardClient from "@/app/components/client/account/AccountDashboardClient";
import { getCookies, getCustomerOrder, Customer as fetchCustomer } from "@/app/components/client/account/actions";
import { Customer } from "@/app/lib/shopify/types";

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

  return <AccountDashboardClient customer={customer} orders={orders} />;
}

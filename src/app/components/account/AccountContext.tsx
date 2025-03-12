'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { use } from 'react';
import { CustomerResponse as ShopifyCustomerResponse, OrdersResponse } from '@/app/lib/shopify/types'; // Adjust the import to use the correct type

export type Order = {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
        variant: {
          title: string;
          image: {
            url: string;
          } | null;
        } | null;
      };
    }>;
  };
};

export type Customer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  displayName: string;
  defaultAddress?: {
    id: string;
    formatted: string[];
  } | null;
};

type UserState = {
    customer: ShopifyCustomerResponse; // Update type to ShopifyCustomerResponse
    orders: Order[];
};

type UserContextType = UserState & {
  fetchUserData: () => Promise<void>;
  setCustomer: (customer: ShopifyCustomerResponse) => void; // Update type to ShopifyCustomerResponse
  setOrders: (orders: Order[]) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ 
  children, 
  customer: customerPromise,
  orders: ordersPromise
}: { 
  children: React.ReactNode, 
  customer: Promise<ShopifyCustomerResponse>, // Update type to Promise<ShopifyCustomerResponse>
  orders: Promise<OrdersResponse>
}) {
  
  // Unwrap promises using the 'use' hook
  const customerData = use(customerPromise);
  const ordersResponse = use(ordersPromise);
  
  const [state, setState] = useState<UserState>({
    customer: customerData,
    orders: ordersResponse.orders || [],
  });

  const setCustomer = (customer: ShopifyCustomerResponse) => { // Update type to ShopifyCustomerResponse
    setState(prevState => ({
      ...prevState,
      customer
    }));
  };

  const setOrders = (orders: Order[]) => {
    setState(prevState => ({
      ...prevState,
      orders
    }));
  };

  // This function will refresh the data by simply setting state with the data we already have
  // No need for additional API calls since we're in a client component
  const fetchUserData = async () => {
    // Just re-use the data we already have from the server
    setState({
      customer: customerData,
      orders: ordersResponse.orders || [],
    });
  };


  const value = useMemo(
    () => ({
      ...state,
      fetchUserData,
      setCustomer,
      setOrders
    }),
    [state, fetchUserData, setCustomer, setOrders]
  );
  
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
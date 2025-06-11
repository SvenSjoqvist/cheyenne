'use client';

import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { use } from 'react';
import { CustomerResponse as ShopifyCustomerResponse, OrdersResponse, Customer } from '@/app/lib/shopify/types';

export type Order = {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  customer?: {
    email: string;
  };
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    edges: Array<{
      node: {
        id: string;
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


type UserState = {
    customer: Customer | null;
    orders: Order[];
    user: {
        email: string;
        id: string;
    } | null;
};

type UserContextType = UserState & {
  fetchUserData: () => Promise<void>;
  setCustomer: (customer: Customer | null) => void;
  setOrders: (orders: Order[]) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ 
  children, 
  customer: customerPromise,
  orders: ordersPromise
}: { 
  children: React.ReactNode, 
  customer: Promise<ShopifyCustomerResponse>,
  orders: Promise<OrdersResponse>
}) {
  const customerData = use(customerPromise);
  const ordersResponse = use(ordersPromise);
  
  const [state, setState] = useState<UserState>({
    customer: customerData.customer,
    orders: ordersResponse.orders || [],
    user: {
      email: customerData.customer?.email || '',
      id: customerData.customer?.id || ''
    }
  });

  const setCustomer = useCallback((customer: Customer | null) => {
    setState(prevState => ({
      ...prevState,
      customer,
      user: {
        email: customer?.email || '',
        id: customer?.id || ''
      }
    }));
  }, []);

  const setOrders = useCallback((orders: Order[]) => {
    setState(prevState => ({
      ...prevState,
      orders
    }));
  }, []);

  const fetchUserData = useCallback(async () => {
    setState({
      customer: customerData.customer,
      orders: ordersResponse.orders || [],
      user: {
        email: customerData.customer?.email || '',
        id: customerData.customer?.id || ''
      }
    });
  }, [customerData.customer, ordersResponse.orders]);

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
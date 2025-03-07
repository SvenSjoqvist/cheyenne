'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

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
  customer: Customer | null;
  orders: Order[];
};

type UserContextType = UserState & {
  fetchUserData: () => Promise<void>;
  handleLogout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ 
  children, 
  customer: customerPromise,
  orders: ordersPromise
}: { 
  children: React.ReactNode, 
  customer: Promise<any>,
  orders: Promise<any>
}) {
  const router = useRouter();
  
  // Unwrap promises using the 'use' hook
  const customerData = use(customerPromise);
  const ordersData = use(ordersPromise);

  console.log(customerData);
  console.log(ordersData);
  
  const [state, setState] = useState<UserState>({
    customer: customerData?.customer || null,
    orders: ordersData?.orders || [],
  });

  // This function will refresh the data by simply setting state with the data we already have
  // No need for additional API calls since we're in a client component
  const fetchUserData = async () => {
    console.log('Refreshing user data from context...');
    // Just re-use the data we already have from the server
    setState({
      customer: customerData?.customer || null,
      orders: ordersData?.orders || [],
    });
  };

  const handleLogout = async () => {
    try {
      // We still need this API call to handle the logout server-side
      await fetch('/api/logout', { method: 'POST' });
      
      setState({
        customer: null,
        orders: [],
      });
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      console.error('Logout error:', err);
    }
  };

  const value = useMemo(
    () => ({
      ...state,
      fetchUserData,
      handleLogout,
    }),
    [state]
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
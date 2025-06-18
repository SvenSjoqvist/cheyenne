"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EditableDetailsCard from './EditableDetailsCard';
import { updateReturnCustomerInfo, updateReturnProductInfo } from '@/app/lib/actions/returns';

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
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  additionalNotes: string | null;
  items: ReturnItem[];
};

interface EditableField {
  key: string;
  label: string;
  value: string;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface ProductDataItem {
  id: string;
  productName: string;
  quantity: number;
  reason: string;
  variant: string;
}

interface EditableReturnCardsProps {
  returnRequest: Return;
}

export default function EditableReturnCards({ returnRequest }: EditableReturnCardsProps) {
  const router = useRouter();
  const [returnData, setReturnData] = useState<Return>(returnRequest);

  const handleCustomerSave = async (updatedData: EditableField[]) => {
    try {
      const customerData: CustomerData = {
        firstName: updatedData.find(d => d.key === 'firstName')?.value || '',
        lastName: updatedData.find(d => d.key === 'lastName')?.value || '',
        email: updatedData.find(d => d.key === 'email')?.value || '',
        phone: updatedData.find(d => d.key === 'phone')?.value || ''
      };

      // The server action now throws errors instead of returning success/error objects
      await updateReturnCustomerInfo(returnData.id, customerData);
      
      // If we get here, the action was successful
      setReturnData(prev => ({
        ...prev,
        customerEmail: customerData.email
      }));
      router.refresh();
    } catch (error) {
      console.error('Error updating customer info:', error);
      throw error; // Re-throw to let EditableDetailsCard handle the error
    }
  };

  const handleProductSave = async (updatedData: EditableField[]) => {
    try {
      const productData: ProductDataItem[] = returnData.items.map(item => {
        const itemData = updatedData.filter(d => d.key.startsWith(`item_${item.id}_`));
        return {
          id: item.id,
          productName: itemData.find(d => d.key === `item_${item.id}_productName`)?.value || item.productName,
          quantity: parseInt(itemData.find(d => d.key === `item_${item.id}_quantity`)?.value || item.quantity.toString()),
          reason: itemData.find(d => d.key === `item_${item.id}_reason`)?.value || item.reason,
          variant: itemData.find(d => d.key === `item_${item.id}_variant`)?.value || item.variant
        };
      });

      // The server action now throws errors instead of returning success/error objects
      await updateReturnProductInfo(returnData.id, productData);
      
      // If we get here, the action was successful
      setReturnData(prev => ({
        ...prev,
        items: productData.map(pd => ({
          ...prev.items.find(item => item.id === pd.id)!,
          ...pd
        }))
      }));
      router.refresh();
    } catch (error) {
      console.error('Error updating product info:', error);
      throw error; // Re-throw to let EditableDetailsCard handle the error
    }
  };

  // Prepare customer data for editable card
  const customerData: EditableField[] = [
    { key: 'firstName', label: 'First Name', value: returnData.customerEmail.split('@')[0] },
    { key: 'lastName', label: 'Last Name', value: 'N/A' },
    { key: 'email', label: 'Email', value: returnData.customerEmail },
    { key: 'phone', label: 'Phone', value: 'N/A' }
  ];

  // Prepare product data for editable card
  const productData: EditableField[] = returnData.items.flatMap(item => [
    { key: `item_${item.id}_productName`, label: 'Product Name', value: item.productName },
    { key: `item_${item.id}_quantity`, label: 'Quantity', value: item.quantity.toString() },
    { key: `item_${item.id}_reason`, label: 'Reason', value: item.reason },
    { key: `item_${item.id}_variant`, label: 'More Info', value: item.variant }
  ]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full mb-8">
      <div className="flex-1 min-w-0">
        <EditableDetailsCard 
          title="Customer Information" 
          data={customerData}
          onSave={handleCustomerSave}
        />
      </div>
      <div className="flex-1 min-w-0">
        <EditableDetailsCard 
          title="Product Information" 
          data={productData}
          onSave={handleProductSave}
        />
      </div>
    </div>
  );
} 
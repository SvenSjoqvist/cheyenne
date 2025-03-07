// components/account/AccountDetails.tsx
'use client';

import { useState } from 'react';
import { Customer } from '@/app/components/account/AccountContext';
import { customerUpdate } from '@/app/lib/auth/auth';

// Define an interface for the form data
interface CustomerFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Define the input type for the customerUpdate function
interface CustomerUpdateInput {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  password?: string;
  currentPassword?: string;
}

export default function AccountDetails({ customer }: { customer: Customer }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: customer.firstName || '',
    lastName: customer.lastName || '',
    phone: customer.phone || '',
    email: customer.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  console.log(customer);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    // Validate passwords if trying to change password
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        setIsLoading(false);
        return;
      }
      
      if (!formData.currentPassword) {
        setError('Current password is required to set a new password');
        setIsLoading(false);
        return;
      }
    }
    
    try {
      // Create the update input object
      const updateInput: CustomerUpdateInput = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
      };
      
      // Only add password fields if a new password is provided
      if (formData.newPassword) {
        updateInput.password = formData.newPassword;
        updateInput.currentPassword = formData.currentPassword;
      }
      
      const result = await customerUpdate(updateInput);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Your account details have been updated successfully');
        setIsEditing(false);
        
        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='p-10 flex flex-1 flex-col py-20 w-full h-full '>
      <div className="flex justify-between mb-6 flex-col font-darker-grotesque text-black">
        <h1 className="text-2xl font-medium">account details</h1>
    
        <div>
            <p className="text-lg">name: {customer.firstName} {customer.lastName}
            </p>
        
            <p className="text-lg">email: {customer.email}</p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className='flex flex-col gap-5'>
                <label htmlFor="currentPassword" className='text-2xl font-medium'>password</label>
                <input type="password" id="currentPassword" name="currentPassword" className='placeholder:text-black placeholder:text-sm' placeholder='current password' value={formData.currentPassword} onChange={handleChange} />
                <input type="password" id="newPassword" name="newPassword" className='placeholder:text-black placeholder:text-sm' placeholder='new password' value={formData.newPassword} onChange={handleChange} />
                <input type="password" id="confirmPassword" name="confirmPassword" className='placeholder:text-black placeholder:text-sm' placeholder='confirm password' value={formData.confirmPassword} onChange={handleChange} />
              </div>
              <button type="submit" className='text-black border border-black rounded-md px-4 py-2' >change your password</button>
              <div>
                
              </div>
            </form>
          </div>
        </div>
    </div>
  );
}
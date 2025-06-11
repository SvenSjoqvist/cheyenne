// components/account/AccountDetails.tsx
"use client";

import { useState } from "react";

import { updateCustomerPassword } from "@/app/lib/shopify";
import { Customer } from "@/app/lib/shopify/types";
// Define an interface for the form data
interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  newPassword: string;
}

export default function AccountDetails({ customer }: { customer: Customer }) {
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: customer.firstName || "",
    lastName: customer.lastName || "",
    email: customer.email || "",
    newPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Only attempt password update if both fields are provided
      if (formData.newPassword) {
        const result = await updateCustomerPassword(formData.newPassword);

        if (result.error) {
          console.log(result.error);
        } else {
          console.log("Your password has been updated successfully");

          // Clear password fields
          setFormData((prev) => ({
            ...prev,
            newPassword: "",
          }));
        }
      }
    } catch (err: unknown) {
      console.log(
        err instanceof Error ? err.message : "Failed to update password"
      );
    }
  };

  return (
    <div className="p-10 flex flex-1 flex-col py-20 w-full h-screen">
      <div className="flex justify-between mb-6 flex-col font-darker-grotesque text-black">
        <h1 className="text-2xl font-medium">account details</h1>

        <div>
          <p className="text-lg">
            name: {customer.firstName} {customer.lastName}
          </p>

          <p className="text-lg">email: {customer.email}</p>
        </div>
        <div>
        <form onSubmit={handleSubmit}>
  {/* Hidden username field for accessibility */}
  <input 
    type="email" 
    id="username" 
    name="username" 
    defaultValue={customer.email || ""}
    autoComplete="username" 
    className="hidden"
    aria-hidden="true"
  />
  
  <div className="flex flex-col">
    <label htmlFor="newPassword" className="text-2xl font-medium mb-1">
      password
    </label>
    <input
      type="password"
      id="newPassword"
      name="newPassword"
      className="placeholder:text-black placeholder:text-sm p-2 rounded-lg border border-black w-2/3 focus:border-black focus:outline-none"
      placeholder="****************"
      value={formData.newPassword}
      onChange={handleChange}
      autoComplete="new-password"
    />
  </div>
  <button
    type="submit"
    className="text-blackrounded-md mt-2 text-lg underline underline-offset-6 decoration-1"
  >
    change your password
  </button>
</form>
        </div>
      </div>
    </div>
  );
}

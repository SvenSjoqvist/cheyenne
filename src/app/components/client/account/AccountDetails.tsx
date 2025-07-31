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

interface Alert {
  type: "success" | "error";
  message: string;
}

export default function AccountDetails({ customer }: { customer: Customer }) {
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: customer.firstName || "",
    lastName: customer.lastName || "",
    email: customer.email || "",
    newPassword: "",
  });
  const [alert, setAlert] = useState<Alert | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (formData.newPassword) {
        const result = await updateCustomerPassword(formData.newPassword);

        if (result.error) {
          setAlert({
            type: "error",
            message:
              result.error || "Failed to update password. Please try again.",
          });
        } else {
          setAlert({
            type: "success",
            message: "Your password has been updated successfully!",
          });

          // Clear password fields
          setFormData((prev) => ({
            ...prev,
            newPassword: "",
          }));

          // Clear alert after 5 seconds
          setTimeout(() => {
            setAlert(null);
          }, 5000);
        }
      }
    } catch (err: unknown) {
      setAlert({
        type: "error",
        message:
          err instanceof Error ? err.message : "Failed to update password",
      });
    }
  };

  return (
    <div className="p-4 lg:p-10 w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-semibold font-darker-grotesque mb-6 mt-8">Account Details</h1>

        {/* Alert Message */}
        {alert && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              alert.type === "success"
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
            role="alert"
          >
            <p className="text-sm">{alert.message}</p>
          </div>
        )}

        <div className="space-y-6 lg:space-y-0 lg:flex lg:gap-12">
          {/* Account Info */}
          <div className="lg:flex-1">
            <div className="space-y-2">
              <p className="text-lg font-medium font-darker-grotesque">
                Name: {customer.firstName} {customer.lastName}
              </p>
              <p className="text-lg font-medium font-darker-grotesque">
                Email: {customer.email}
              </p>
            </div>
          </div>
          
          {/* Password Section */}
          <div className="lg:flex-1">
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

              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-lg font-medium font-darker-grotesque mb-2"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className="w-full p-3 rounded-lg border border-black focus:border-black focus:outline-none placeholder:text-gray-500"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>
                <button
                  type="submit"
                  className="text-black text-lg underline underline-offset-4 decoration-1 font-medium hover:no-underline transition-all font-darker-grotesque"
                  disabled={!formData.newPassword}
                >
                  Change your password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import LoginForm from "@/app/components/admin/auth/LoginForm";

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);

  // If already logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-darker-grotesque font-semibold tracking-wider mb-2">
              Admin Login
            </h1>
            <p className="text-gray-600">Sign in to access the admin dashboard</p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
} 
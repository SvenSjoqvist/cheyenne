import "@/app/globals.css";
import Sidebar from "@/app/components/admin/Sidebar";
import { DashboardProvider } from "@/app/components/admin/DashboardContext";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { verifyUser } from "@/app/lib/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-[200px]">
        <DashboardProvider>{children}</DashboardProvider>
      </main>
    </div>
  );
}

import "@/app/globals.css";
import Sidebar from "@/app/components/admin/Sidebar";
import { DashboardProvider } from "@/app/components/admin/DashboardContext";

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

import SessionProvider from "@/app/components/providers/SessionProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="bg-white min-h-screen w-full">
        {children}
      </div>
    </SessionProvider>
  );
} 
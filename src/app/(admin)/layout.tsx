export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white min-h-screen w-full">
      {children}
    </div>
  );
} 
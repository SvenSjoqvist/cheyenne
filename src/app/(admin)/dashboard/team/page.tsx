import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma/client";
import TeamManagementClient from "@/app/components/admin/team/TeamManagementClient";

export default async function TeamPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/admin/login");
  }

  // Fetch all users from the database
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      image: true,
      emailVerified: true,
      // Don't select password for security
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="pt-20 bg-[#F7F7F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-4 justify-center items-center mb-10">
          <h1 className="text-[40px] font-darker-grotesque tracking-wider font-regular">Team Management</h1>
          <p className="text-gray-600 text-center max-w-2xl">
            Manage team members and control access to the admin dashboard
          </p>
        </div>

        <TeamManagementClient users={users} />
      </div>
    </div>
  );
}
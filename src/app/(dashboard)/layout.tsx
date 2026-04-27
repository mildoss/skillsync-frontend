import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getMe } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileSidebar } from "@/components/layout/MobileSidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getMe();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />

      <div className="flex flex-1">
        <aside className="bg-card hidden w-64 border-r md:block">
          <Sidebar user={user} />
        </aside>

        <main className="bg-muted/20 flex-1 p-4 md:p-8">
          <MobileSidebar user={user} />
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

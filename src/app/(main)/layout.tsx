import { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { cookies } from "next/headers";
import { getMe } from "@/lib/api";

export default async function MainLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access-token")?.value;

  let user = null;
  if (token) {
    user = await getMe();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user}/>
      <main className="bg-muted/20 flex-1">{children}</main>
    </div>
  );
}
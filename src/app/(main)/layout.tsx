import { ReactNode } from "react";
import { Header } from "@/components/layout/Header";

export default function MainLayout({ children }: { children: ReactNode }) {

  return (
    <div className="flex min-h-screen flex-col">
      <Header/>
      <main className="bg-muted/20 flex-1">{children}</main>
    </div>
  );
}
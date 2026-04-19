import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-muted/20 flex min-h-screen flex-col items-center justify-center p-4">
      <Link href="/" className="text-primary mb-8 text-3xl font-bold">
        SkillSync
      </Link>
      {children}
    </div>
  );
}

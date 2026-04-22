"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { User } from "@/types/users";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { logoutAction } from "@/actions/auth";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileHeaderMenu } from "@/components/layout/MobileHeaderMenu";

const navLinks = [
  { name: "Vacancies", href: "/vacancies" },
  { name: "Candidates", href: "/candidates" },
  { name: "Companies", href: "/companies" },
];

export const Header = ({ user }: { user: User | null }) => {
  const pathName = usePathname();

  return (
    <header
      className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-primary flex items-center gap-2 text-xl font-bold">
          SkillSync
        </Link>

        <nav className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "hover:text-primary text-sm font-medium transition-colors",
                pathName === link.href ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <div className="hidden items-center gap-4 md:flex">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="hover:bg-muted flex items-center gap-3 rounded-full py-1 pr-4 pl-1 transition-colors"
                >
                  <CustomAvatar imageUrl={user.avatarUrl} fallbackText={user.name} size="sm" />
                  <span className="text-sm font-semibold">{user.name}</span>
                </Link>

                <form action={logoutAction}>
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="size-5" />
                  </Button>
                </form>
              </div>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          <MobileHeaderMenu user={user} />
        </div>
      </div>
    </header>
  );
};
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, Sparkles } from "lucide-react";
import { User } from "@/types/users";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileHeaderMenu } from "@/components/layout/MobileHeaderMenu";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { ChatCounter } from "@/components/layout/ChatCounter";
import { LogoutButton } from "@/components/layout/LogoutButton";

const navLinks = [
  { name: "Vacancies", href: "/vacancies" },
  { name: "Candidates", href: "/candidates" },
  { name: "Companies", href: "/companies" },
];

export const Header = ({ user, unreadCount = 0 }: { user: User | null; unreadCount?: number }) => {
  const pathName = usePathname();

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
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
          {user && (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/pricing"
                title="Top up AI Credits"
                className="group hidden lg:flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 transition-all hover:border-primary/40 hover:bg-primary/10"
              >
                <Sparkles className="size-3.5 text-primary group-hover:animate-pulse" />
                <span className="text-xs font-bold text-foreground">
                  {user.aiCredits}
                </span>
                <Plus className="size-3 text-muted-foreground transition-transform group-hover:scale-125 group-hover:text-primary" />
              </Link>

              <ChatCounter initialCount={unreadCount} />
              <NotificationBell />
            </div>
          )}

          <ThemeToggle />

          <div className="hidden items-center gap-4 md:flex">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="hover:bg-muted flex items-center gap-3 rounded-full py-1 pl-1 transition-colors"
                >
                  <CustomAvatar imageUrl={user.avatarUrl} fallbackText={user.name} size="sm" />
                  <span className="text-sm font-semibold max-w-25 truncate">{user.name}</span>
                </Link>

                <LogoutButton
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  icon={<LogOut className="size-5" />}
                />
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
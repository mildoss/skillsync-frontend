'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent, SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, Menu, UserIcon } from "lucide-react";
import { User } from "@/types/users";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { logoutAction } from "@/actions/auth";

const navLinks = [
  { name: "Vacancies", href: "/vacancies" },
  { name: "Candidates", href: "/candidates" },
  { name: "Companies", href: "/companies" },
];

export const Header = ({user}: {user: User | null}) => {
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

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <span className="sr-only">Open menu</span>
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="flex flex-col">
              <SheetHeader>
                <SheetTitle className="text-primary text-left text-xl font-bold">
                  SkillSync
                </SheetTitle>
                <SheetDescription className="sr-only">Navigation menu</SheetDescription>
              </SheetHeader>

              {user && (
                <div className="mt-6 flex items-center gap-3 rounded-xl border p-4">
                  <CustomAvatar imageUrl={user.avatarUrl} fallbackText={user.name} size="md" />
                  <div className="flex flex-col">
                    <span className="font-bold">{user.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {user.position || "User"}
                    </span>
                  </div>
                </div>
              )}

              <nav className="mt-8 flex flex-col gap-4 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "hover:text-primary text-lg font-medium transition-colors",
                      pathName === link.href ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-3 pb-6">
                {user ? (
                  <>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href="/profile">
                        <UserIcon className="mr-2 size-4" /> My Profile
                      </Link>
                    </Button>
                    <form action={logoutAction} className="w-full">
                      <Button type="submit" variant="destructive" className="w-full">
                        Log out
                      </Button>
                    </form>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/login">Log in</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/register">Register</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
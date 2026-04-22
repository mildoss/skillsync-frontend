"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, UserIcon } from "lucide-react";
import { User } from "@/types/users";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { logoutAction } from "@/actions/auth";

const navLinks = [
  { name: "Vacancies", href: "/vacancies" },
  { name: "Candidates", href: "/candidates" },
  { name: "Companies", href: "/companies" },
];

export const MobileHeaderMenu = ({ user }: { user: User | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <span className="sr-only">Open menu</span>
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="flex flex-col">
          <SheetHeader>
            <SheetTitle className="text-primary text-left text-xl font-bold">SkillSync</SheetTitle>
            <SheetDescription className="sr-only">Navigation menu</SheetDescription>
          </SheetHeader>

          <div
            className="flex flex-1 flex-col"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a, button")) {
                setIsOpen(false);
              }
            }}
          >
            {user && (
              <div className="mt-6 flex items-center gap-3 rounded-xl border p-4">
                <CustomAvatar imageUrl={user.avatarUrl} fallbackText={user.name} size="md" />
                <div className="flex flex-col">
                  <span className="font-bold">{user.name}</span>
                  <span className="text-muted-foreground text-xs">{user.position || "User"}</span>
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

            <div className="mt-auto flex flex-col gap-3 pt-6 pb-6">
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
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

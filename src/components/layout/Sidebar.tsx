"use client";

import { User } from "@/types/users";
import { usePathname } from "next/navigation";
import { Briefcase, Building, FileText, UserIcon, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const Sidebar = ({ user }: { user: User }) => {
  const pathName = usePathname();

  const applicantLinks = [
    { name: "My Profile", href: "/profile", icon: UserIcon },
    { name: "My Applications", href: "/applications", icon: FileText },
  ];

  const employerLinks = [
    { name: "My Profile", href: "/profile", icon: UserIcon },
    { name: "My Company", href: "/company", icon: Building },
    { name: "My Vacancies", href: "/my-vacancies", icon: Briefcase },
  ];

  if (user.role === "EMPLOYER" && user.companyRole === "OWNER") {
    employerLinks.push({ name: "Team Requests", href: "/team-requests", icon: Users });
  }

  const links = user.role === "APPLICANT" ? applicantLinks : employerLinks;

  return (
    <nav className="flex flex-col gap-2 p-4">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathName === link.href || pathName.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
};

"use client";

import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

type LogoutButtonProps = {
  variant?: "default" | "destructive" | "outline" | "ghost" | "secondary" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export function LogoutButton({
  variant = "destructive",
  size = "default",
  className = "",
  icon,
  children,
}: LogoutButtonProps): ReactNode {
  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <Button onClick={handleLogout} variant={variant} size={size} className={className}>
      {icon}
      {children}
    </Button>
  );
}
"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { User } from "@/types/users";

export const MobileSidebar = ({ user }: { user: User }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Menu className="size-4" />
            Dashboard menu
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 pt-6">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) {
                setIsOpen(false);
              }
            }}
          >
            <Sidebar user={user} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  fallbackHref: string;
  label?: string;
};

export const BackButton = ({ fallbackHref, label = "Back to search" }: BackButtonProps) => {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-foreground -ml-2 mb-6 cursor-pointer gap-1"
      onClick={() => {
        if (window.history.length > 2) {
          router.back();
        } else {
          router.push(fallbackHref);
        }
      }}
    >
      <ChevronLeft className="size-4" />
      {label}
    </Button>
  );
};
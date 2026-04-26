"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirmAction: () => void;
  onCancelAction: () => void;
  isPending?: boolean;
};

export const ConfirmModal = ({
  isOpen,
  title,
  description,
  onConfirmAction,
  onCancelAction,
  isPending,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-card animate-in fade-in zoom-in-95 w-full max-w-md rounded-2xl p-6 shadow-xl duration-200">
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-destructive/10 text-destructive rounded-full p-2">
            <AlertTriangle className="size-6" />
          </div>
          <h3 className="text-lg font-bold">{title}</h3>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancelAction} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirmAction} disabled={isPending}>
            {isPending ? "Processing..." : "Yes, I'm sure"}
          </Button>
        </div>
      </div>
    </div>
  );
};
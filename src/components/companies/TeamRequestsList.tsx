"use client";

import { useState, useTransition } from "react";
import { TeamRequest } from "@/types/companies";
import { handleJoinRequestAction } from "@/actions/company";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const TeamRequestsList = ({
  initialRequests,
  companyId,
  }: {
  initialRequests: TeamRequest[];
  companyId: string;
}) => {
  const [requests, setRequests] = useState<TeamRequest[]>(initialRequests);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAction = (requestId: string, status: "APPROVED" | "REJECTED") => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));

    startTransition(async () => {
      const res = await handleJoinRequestAction(companyId, requestId, status);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(status === "APPROVED" ? "Recruiter approved!" : "Request rejected");
        router.refresh();
      }
    });
  };

  if (requests.length === 0) {
    return (
      <div className="border-border rounded-xl border border-dashed py-12 text-center text-muted-foreground">
        No pending requests to join your team.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <div
          key={req.id}
          className="flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-4">
            <CustomAvatar imageUrl={req.user.avatarUrl} fallbackText={req.user.name} size="md" />
            <div className="flex flex-col">
              <span className="font-bold">{req.user.name}</span>
              <span className="text-muted-foreground text-sm">{req.user.email}</span>
              <span className="text-muted-foreground mt-1 text-xs">
                Requested on {new Date(req.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={isPending}
              onClick={() => handleAction(req.id, "REJECTED")}
            >
              <X className="mr-2 size-4" /> Reject
            </Button>
            <Button
              variant="default"
              className="bg-success text-success-foreground hover:bg-success/90"
              disabled={isPending}
              onClick={() => handleAction(req.id, "APPROVED")}
            >
              <Check className="mr-2 size-4" /> Approve
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
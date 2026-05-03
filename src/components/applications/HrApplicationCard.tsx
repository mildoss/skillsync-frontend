"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Application, ApplicationStatus } from "@/types/application";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { Button } from "@/components/ui/button";
import { updateApplicationStatusAction } from "@/actions/application";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { ExpandableText } from "@/components/ui/expandable-text";
import { Check, X } from "lucide-react";

export const HrApplicationCard = ({ application }: { application: Application }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const applicant = application.applicant;

  if (!applicant) return null;

  const handleStatusUpdate = (status: Exclude<ApplicationStatus, "PENDING">) => {
    startTransition(async () => {
      const res = await updateApplicationStatusAction(application.id, status);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Candidate marked as ${status.toLowerCase()}`);
        router.refresh();
      }
    });
  };

  return (
    <div className="bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-sm sm:flex-row sm:items-start">
      <Link href={`/candidates/${applicant.id}`} className="shrink-0">
        <CustomAvatar imageUrl={applicant.avatarUrl} fallbackText={applicant.name} size="md" />
      </Link>

      <div className="flex-1 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <Link
              href={`/candidates/${applicant.id}`}
              className="hover:text-primary transition-colors"
            >
              <h3 className="text-lg leading-tight font-bold">{applicant.name}</h3>
            </Link>
            <p className="text-muted-foreground text-sm font-medium">{applicant.position}</p>
          </div>
          <div className="mt-2 sm:mt-0">
            <ApplicationStatusBadge status={application.status} />
          </div>
        </div>

        {application.coverLetter && (
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <span className="mb-1 block font-semibold">Cover Letter</span>
            <ExpandableText text={application.coverLetter} maxLength={150} />
          </div>
        )}

        {application.status === "PENDING" || application.status === "REVIEWING" ? (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
              disabled={isPending}
              onClick={() => handleStatusUpdate("REJECTED")}
            >
              <X className="mr-1 size-4" /> Reject
            </Button>

            {application.status === "PENDING" && (
              <Button
                variant="outline"
                size="sm"
                className="text-primary hover:bg-primary/10 border-primary/20"
                disabled={isPending}
                onClick={() => handleStatusUpdate("REVIEWING")}
              >
                Mark as Reviewed
              </Button>
            )}

            <Button
              size="sm"
              className="bg-success text-success-foreground hover:bg-success/90"
              disabled={isPending}
              onClick={() => handleStatusUpdate("INVITED")}
            >
              <Check className="mr-1 size-4" /> Invite to Interview
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

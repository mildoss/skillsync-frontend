"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Application, ApplicationStatus } from "@/types/application";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { Button } from "@/components/ui/button";
import { updateApplicationStatusAction } from "@/actions/application";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { ExpandableText } from "@/components/ui/expandable-text";
import { BrainCircuit, Check, Sparkles, X } from "lucide-react";
import { getLatestDraft } from "@/lib/server-api";
import { evaluateCandidateAction } from "@/actions/ai";

export const HrApplicationCard = ({ application }: { application: Application }) => {
  const [isPending, startTransition] = useTransition();
  const [matching, setMatching] = useState<{ score: number; reason: string } | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const checkMatch = async () => {
      try {
        const res = await getLatestDraft("MATCHING", application.id);
        if (isMounted && res?.data?.data) {
          setMatching(res.data.data);
        }
      } catch (error) {
        console.error("Failed to check AI matching", error);
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    void checkMatch();

    return () => {
      isMounted = false;
    };
  }, [application.id]);

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

  const handleEvaluate = async () => {
    setIsEvaluating(true);

    const res = await evaluateCandidateAction(
      application.vacancyId,
      applicant.id,
      application.id
    );

    setIsEvaluating(false);

    if (res.error) {
      toast.error(res.error);
    } else if (res.data) {
      setMatching({ score: res.data.score, reason: res.data.reason });
      toast.success("Analysis complete!");
    }
  };

  return (
    <div className="bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-sm sm:flex-row sm:items-start">
      <Link href={`/candidates/${applicant.id}`} className="shrink-0">
        <CustomAvatar imageUrl={applicant.avatarUrl} fallbackText={applicant.name} size="md" />
      </Link>

      <div className="flex-1 space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href={`/candidates/${applicant.id}`}
              className="hover:text-primary transition-colors"
            >
              <h3 className="text-lg leading-tight font-bold">{applicant.name} {applicant.surname}</h3>
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

        <div className="mt-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-500">
              <BrainCircuit className="size-5" />
              <span className="text-sm font-bold">AI Candidate Match</span>
            </div>

            {!matching && !isChecking && (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 gap-2 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20"
                onClick={handleEvaluate}
                disabled={isEvaluating}
              >
                <Sparkles className={isEvaluating ? "size-3 animate-spin" : "size-3"} />
                {isEvaluating ? "Analyzing..." : "Evaluate (1 credit)"}
              </Button>
            )}
          </div>

          {isChecking ? (
            <div className="h-4 w-24 animate-pulse rounded bg-indigo-500/10" />
          ) : matching ? (
            <div className="flex items-center gap-4">
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-black ${
                  matching.score >= 80
                    ? "bg-green-500/20 text-green-600"
                    : matching.score >= 50
                      ? "bg-amber-500/20 text-amber-600"
                      : "bg-red-500/20 text-red-600"
                }`}
              >
                {matching.score}%
              </div>
              <p className="text-sm leading-snug font-medium">{matching.reason}</p>
            </div>
          ) : (
            <p className="text-muted-foreground text-xs">
              AI analysis is not available for this candidate yet.
            </p>
          )}
        </div>

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

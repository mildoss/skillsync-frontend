"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MailPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { inviteCandidateAction } from "@/actions/application";
import { toast } from "sonner";
import { Vacancy } from "@/types/vacancies";

type InviteModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  candidateId: string;
  candidateName: string;
  myVacancies: Vacancy[];
};

export const InviteModal = ({
  isOpen,
  onCloseAction,
  candidateId,
  candidateName,
  myVacancies,
}: InviteModalProps) => {
  const [selectedVacancyId, setSelectedVacancyId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, myVacancies]);

  if (!isOpen) return null;

  const handleInvite = () => {
    if (!selectedVacancyId) {
      toast.error("Please select a vacancy first.");
      return;
    }

    startTransition(async () => {
      const res = await inviteCandidateAction(candidateId, selectedVacancyId, message);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Invitation sent to ${candidateName}!`);
        onCloseAction();
        router.refresh();
      }
    });
  };

  return (
    <div
      onClick={onCloseAction}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card animate-in fade-in zoom-in-95 w-full max-w-lg rounded-2xl p-6 shadow-xl duration-200"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-success/10 text-success rounded-full p-2">
            <MailPlus className="size-6" />
          </div>
          <h3 className="text-lg font-bold">Invite {candidateName}</h3>
        </div>

        {myVacancies.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-muted-foreground mb-4">
              You need to create at least one active vacancy to invite candidates.
            </p>
            <Button variant="outline" onClick={onCloseAction}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Select Vacancy *</label>
                <select
                  value={selectedVacancyId}
                  onChange={(e) => setSelectedVacancyId(e.target.value)}
                  className="border-input focus:ring-primary flex h-11 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2"
                  disabled={isPending}
                >
                  <option value="" disabled>
                    Choose a vacancy...
                  </option>
                  {myVacancies.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Message (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi! We loved your profile and would like to invite you to apply..."
                  className="border-input focus-visible:ring-ring flex min-h-24 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onCloseAction} disabled={isPending}>
                Cancel
              </Button>
              <Button onClick={handleInvite} disabled={isPending || !selectedVacancyId}>
                {isPending ? "Sending..." : "Send Invite"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
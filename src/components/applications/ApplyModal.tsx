"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, History, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { applyForVacancyAction } from "@/actions/application";
import { toast } from "sonner";
import { getLatestDraft } from "@/lib/server-api";
import { generateCoverLetterAction } from "@/actions/ai";
import { useLocalStorage } from "@/hooks/use-local-storage";

type ApplyModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  vacancyId: string;
  vacancyTitle: string;
};

export const ApplyModal = ({ isOpen, onCloseAction, vacancyId, vacancyTitle }: ApplyModalProps) => {
  const [localDraft, setLocalDraft, clearLocalDraft] = useLocalStorage(`draft_${vacancyId}`,"");
  const [coverLetter, setCoverLetter] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [isFetchingDraft, setIsFetchingDraft] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (isOpen) {
      document.body.style.overflow = "hidden";

      const fetchDraft = async () => {
        setIsFetchingDraft(true);

        if (localDraft) {
          setCoverLetter(localDraft);
          setIsDraftLoaded(true);
          setIsFetchingDraft(false);
          return;
        }

        const res = await getLatestDraft("COVER_LETTER", vacancyId);

        if (!isMounted) return;

        if (res.data?.text) {
          setCoverLetter(res.data.text);
          setLocalDraft(res.data.text);
          setIsDraftLoaded(true);
        }

        setIsFetchingDraft(false);
      };


      void fetchDraft();

      return () => {
        isMounted = false;
        document.body.style.overflow = "unset";
        setIsDraftLoaded(false);
        setIsFetchingDraft(false);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, vacancyId]);

  if (!isOpen) return null;

  const handleApply = () => {
    startTransition(async () => {
      const res = await applyForVacancyAction(vacancyId, coverLetter);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Application sent successfully!");
        clearLocalDraft();
        onCloseAction();
        router.push("/applications");
        router.refresh();
      }
    });
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    const res = await generateCoverLetterAction(vacancyId);
    setIsGenerating(false);

    if (res.error) {
      toast.error(res.error);
    } else if (res.data) {
      setCoverLetter(res.data.text);
      setLocalDraft(res.data.text);
      setIsDraftLoaded(false);
      toast.success(`Generated! You have ${res.data.remainingCredits} credits left. ✨`);
    }
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
          <div className="bg-primary/10 text-primary rounded-full p-2">
            <Send className="size-6" />
          </div>
          <h3 className="text-lg font-bold">Apply for {vacancyTitle}</h3>
        </div>

        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-sm">
              Write a short cover letter to stand out (optional).
            </p>
            {isDraftLoaded && (
              <span className="flex items-center gap-1 text-xs font-medium text-amber-500">
                <History className="size-3" />
                Restored from your latest draft
              </span>
            )}
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="shrink-0 gap-2 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 hover:text-indigo-600"
            onClick={handleGenerateAI}
            disabled={isGenerating || isPending || isFetchingDraft}
          >
            <Sparkles className={isGenerating ? "size-4 animate-pulse" : "size-4"} />
            {isGenerating ? "Thinking..." : "AI Magic"}
          </Button>
        </div>

        <textarea
          value={coverLetter}
          onChange={(e) => {
            setCoverLetter(e.target.value);
            setLocalDraft(e.target.value);
            setIsDraftLoaded(false);
          }}
          placeholder="Hello! I've been working with Next.js and NestJS for 3 years..."
          className="border-input focus-visible:ring-ring mb-6 flex min-h-40 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 disabled:opacity-50"
          disabled={isPending || isGenerating || isFetchingDraft}
        />

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCloseAction}
            disabled={isPending || isGenerating || isFetchingDraft}
          >
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={isPending || isGenerating || isFetchingDraft}>
            {isPending ? "Sending..." : "Send Application"}
          </Button>
        </div>
      </div>
    </div>
  );
};
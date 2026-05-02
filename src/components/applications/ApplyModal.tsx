import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { applyForVacancyAction } from "@/actions/application";
import { toast } from "sonner";

type ApplyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  vacancyId: string;
  vacancyTitle: string;
};

export const ApplyModal = ({ isOpen, onClose, vacancyId, vacancyTitle }: ApplyModalProps) => {
  const [coverLetter, setCoverLetter] = useState("");
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
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    startTransition(async () => {
      const res = await applyForVacancyAction(vacancyId, coverLetter);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Application sent successfully!");
        onClose();
        router.push("/applications");
        router.refresh();
      }
    });
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div onClick={(e) => e.stopPropagation()} className="bg-card animate-in fade-in zoom-in-95 w-full max-w-lg rounded-2xl p-6 shadow-xl duration-200">
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-primary/10 text-primary rounded-full p-2">
            <Send className="size-6" />
          </div>
          <h3 className="text-lg font-bold">Apply for {vacancyTitle}</h3>
        </div>

        <p className="text-muted-foreground mb-4 text-sm">
          Write a short cover letter to stand out and explain why you are a great fit for this role
          (optional).
        </p>

        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Hello! I've been working with Next.js and NestJS for 3 years..."
          className="border-input focus-visible:ring-ring mb-6 flex min-h-32 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2"
          disabled={isPending}
        />

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={isPending}>
            {isPending ? "Sending..." : "Send Application"}
          </Button>
        </div>
      </div>
    </div>
  );
};

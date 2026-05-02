"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ApplyModal } from "./ApplyModal";
import { User } from "@/types/users";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check } from "lucide-react";

type ApplyButtonProps = {
  vacancyId: string;
  vacancyTitle: string;
  user: User | null;
  hasApplied: boolean;
};

export const ApplyButton = ({ vacancyId, vacancyTitle, user, hasApplied }: ApplyButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  if (user?.role === "EMPLOYER") {
    return null;
  }

  if (hasApplied) {
    return (
      <Button
        size="lg"
        variant="secondary"
        className="w-full cursor-not-allowed text-base font-semibold opacity-80"
        disabled
      >
        <Check className="mr-2 size-5 text-success" />
        You already applied
      </Button>
    );
  }

  const handleActionClick = () => {
    if (!user) {
      toast.error("Please log in to apply for this job.");
      router.push("/login");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        size="lg"
        className="w-full cursor-pointer text-base font-semibold"
        onClick={handleActionClick}
      >
        Apply for job
      </Button>

      <ApplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vacancyId={vacancyId}
        vacancyTitle={vacancyTitle}
      />
    </>
  );
};

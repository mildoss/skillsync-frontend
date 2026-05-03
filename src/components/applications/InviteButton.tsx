"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/users";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { InviteModal } from "./InviteModal";
import { Vacancy } from "@/types/vacancies";
import { Building2 } from "lucide-react";

type InviteButtonProps = {
  candidateId: string;
  candidateName: string;
  user: User | null;
  myVacancies: Vacancy[];
};

export const InviteButton = ({
  candidateId,
  candidateName,
  user,
  myVacancies,
}: InviteButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  if (user?.role === "APPLICANT") {
    return null;
  }

  const handleActionClick = () => {
    if (!user) {
      toast.error("Please log in as an Employer to invite candidates.");
      router.push("/login");
      return;
    }

    if (!user.companyId) {
      toast.error("You must register or join a company first to invite candidates.");
      router.push("/company");
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
        <Building2 className="mr-2 size-5" /> Invite to vacancy
      </Button>

      <InviteModal
        isOpen={isModalOpen}
        onCloseAction={() => setIsModalOpen(false)}
        candidateId={candidateId}
        candidateName={candidateName}
        myVacancies={myVacancies}
      />
    </>
  );
};

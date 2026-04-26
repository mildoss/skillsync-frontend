"use client";

import { useState, useTransition } from "react";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { Button } from "@/components/ui/button";
import { removeEmployeeAction } from "@/actions/company";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/confirm-modal";

type Employee = { id: string; name: string; position: string | null; avatarUrl: string | null };

export const ActiveTeamList = ({
  employees,
  companyId,
  }: {
  employees: Employee[];
  companyId: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const [employeeToRemove, setEmployeeToRemove] = useState<Employee | null>(null);
  const router = useRouter();

  const handleConfirmRemove = () => {
    if (!employeeToRemove) return;

    startTransition(async () => {
      const res = await removeEmployeeAction(companyId, employeeToRemove.id);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Recruiter removed from the team");
        router.refresh();
      }
      setEmployeeToRemove(null);
    });
  };

  return (
    <>
      <div className="mt-4 space-y-4">
        {employees.map((emp) => (
          <div key={emp.id} className="flex items-center justify-between rounded-xl border p-4">
            <div className="flex items-center gap-4">
              <CustomAvatar imageUrl={emp.avatarUrl} fallbackText={emp.name} size="md" />
              <div className="flex flex-col">
                <span className="font-bold">{emp.name}</span>
                <span className="text-muted-foreground text-sm">{emp.position || "Recruiter"}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              disabled={isPending}
              onClick={() => setEmployeeToRemove(emp)}
              title="Remove from company"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={!!employeeToRemove}
        title="Remove Recruiter"
        description={`Are you sure you want to remove ${employeeToRemove?.name} from your company? They will lose access to all company vacancies and settings.`}
        onCancelAction={() => setEmployeeToRemove(null)}
        onConfirmAction={handleConfirmRemove}
        isPending={isPending}
      />
    </>
  );
};

"use client";

import { useTransition } from "react";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { Button } from "@/components/ui/button";
import { removeEmployeeAction } from "@/actions/company";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

type Employee = { id: string; name: string; position: string | null; avatarUrl: string | null };

export const ActiveTeamList = ({
  employees,
  companyId,
}: {
  employees: Employee[];
  companyId: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRemove = (employeeId: string) => {
    if (!confirm("Are you sure you want to remove this recruiter?")) return;

    startTransition(async () => {
      await removeEmployeeAction(companyId, employeeId);
      router.refresh();
    });
  };

  return (
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
            onClick={() => handleRemove(emp.id)}
            title="Remove from company"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

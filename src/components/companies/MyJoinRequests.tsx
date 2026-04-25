"use client";

import { useEffect, useState } from "react";
import { CompanyJoinRequest } from "@/types/companies";
import { getMyRequestsAction, cancelJoinRequestAction } from "@/actions/company";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, XCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const MyJoinRequests = () => {
  const [requests, setRequests] = useState<CompanyJoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyRequestsAction();
        if (res.data) setRequests(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleCancel = async (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    await cancelJoinRequestAction(id);
    router.refresh();
  };

  if (isLoading) return <div className="py-10 text-center">Loading requests...</div>;

  if (requests.length === 0) {
    return (
      <div className="border-border rounded-xl border border-dashed py-12 text-center text-muted-foreground">
        You don&apos;t have any active join requests.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <div key={req.id} className="flex items-center justify-between rounded-xl border p-4">
          <Link href={`/companies/${req.companyId}`} className="flex items-center gap-4">
            <CustomAvatar imageUrl={req.company.logoUrl} fallbackText={req.company.name} size="md" />
            <div className="flex flex-col">
              <span className="font-bold">{req.company.name}</span>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {req.company.companyType}
                </Badge>
                {req.status === "PENDING" ? (
                  <span className="flex items-center text-xs font-medium text-warning">
                    <Clock className="mr-1 size-3" /> Pending Review
                  </span>
                ) : (
                  <span className="flex items-center text-xs font-medium text-destructive">
                    <XCircle className="mr-1 size-3" /> Rejected
                  </span>
                )}
              </div>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={() => handleCancel(req.id)}
            title="Cancel Request"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
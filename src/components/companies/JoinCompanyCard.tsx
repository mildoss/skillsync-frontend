import { Companies } from "@/types/companies";
import Link from "next/link";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

type JoinCompanyCardProps = {
  company: Companies;
  isSent: boolean;
  isJoining: boolean;
  onJoin: (companyId: string) => void;
}

export const JoinCompanyCard = ({ company, isSent, isJoining, onJoin }: JoinCompanyCardProps) => (
  <div className="flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors hover:border-primary/50">
    <Link href={`/companies/${company.id}`} className="flex flex-1 items-center gap-4">
      <CustomAvatar imageUrl={company.logoUrl} fallbackText={company.name} size="md" />
      <div className="flex flex-col">
        <span className="font-bold text-foreground">{company.name}</span>
        <Badge variant="secondary" className="mt-1 w-fit text-[10px]">{company.companyType}</Badge>
      </div>
    </Link>

    <Button
      variant={isSent ? "secondary" : "default"}
      size="sm"
      disabled={isSent || isJoining}
      onClick={() => onJoin(company.id)}
    >
      {isSent ? <><CheckCircle2 className="mr-2 size-4 text-success" /> Request Sent</> : "Request Access"}
    </Button>
  </div>
);
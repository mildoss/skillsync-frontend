import { Badge } from "@/components/ui/badge";
import { ApplicationStatus } from "@/types/application";
import { Clock, Eye, CheckCircle2, XCircle } from "lucide-react";

export const ApplicationStatusBadge = ({ status }: { status: ApplicationStatus }) => {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="outline" className="border-warning/50 bg-warning/10 text-warning gap-1">
          <Clock className="size-3" /> Pending
        </Badge>
      );
    case "REVIEWED":
      return (
        <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary gap-1">
          <Eye className="size-3" /> Reviewed
        </Badge>
      );
    case "INVITED":
      return (
        <Badge variant="outline" className="border-success/50 bg-success/10 text-success gap-1">
          <CheckCircle2 className="size-3" /> Invited
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge variant="outline" className="border-destructive/50 bg-destructive/10 text-destructive gap-1">
          <XCircle className="size-3" /> Rejected
        </Badge>
      );
    default:
      return null;
  }
};
import Link from "next/link";
import { Application } from "@/types/application";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { formatDate } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export const ApplicantRequestCard = ({ application }: { application: Application }) => {
  const vacancy = application.vacancy;

  if (!vacancy) return null;

  return (
    <Link
      href={`/vacancies/${vacancy.id}`}
      className="bg-card hover:border-primary/50 group block rounded-xl border p-4 shadow-sm transition-colors sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <CustomAvatar
            imageUrl={vacancy.company.logoUrl}
            fallbackText={vacancy.company.name}
            size="md"
          />
          <div className="flex flex-col">
            <h3 className="text-foreground group-hover:text-primary text-lg leading-tight font-bold transition-colors">
              {vacancy.title}
            </h3>
            <p className="text-muted-foreground mt-1 text-sm font-medium">{vacancy.company.name}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 text-right">
          <ApplicationStatusBadge status={application.status} />
          <span className="text-muted-foreground hidden text-xs sm:block">
            Applied {formatDate(application.createdAt)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <div className="text-muted-foreground text-sm">
          {application.coverLetter ? (
            <span className="italic">{application.coverLetter}</span>
          ) : (
            <span>No cover letter</span>
          )}
        </div>
        <div className="text-primary flex items-center text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
          View Vacancy <ChevronRight className="ml-1 size-4" />
        </div>
      </div>
    </Link>
  );
};

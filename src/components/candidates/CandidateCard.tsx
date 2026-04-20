"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatEnum, formatExperience } from "@/lib/utils";
import { ExpandableText } from "@/components/ui/expandable-text";
import { User } from "@/types/users";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { useRouter } from "next/navigation";

type CandidateCardProps = {
  candidate: User;
};

export const CandidateCard = ({ candidate }: CandidateCardProps) => {
  const router = useRouter();
  return (
    <Link
      href={`/candidates/${candidate.id}`}
      className="bg-card hover:border-primary/50 block rounded-lg border p-4 shadow-sm transition-colors sm:p-6"
    >
      <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex gap-3 sm:gap-4">
          <CustomAvatar imageUrl={candidate.avatarUrl} fallbackText={candidate.name} size="sm" />

          <div className="flex flex-col">
            <h2 className="text-primary text-lg leading-tight font-semibold sm:text-xl">
              {candidate.position || "Position not specified"}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-muted-foreground text-sm font-medium">{candidate.name}</p>
            </div>
          </div>
        </div>
      </div>


      <div className="mb-4 flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground sm:text-sm">
        {candidate.workFormats && candidate.workFormats.length > 0 && (
          <span className="font-semibold text-foreground">
           {candidate.workFormats.map(formatEnum).join(", ")}
          </span>
        )}

        {candidate.employmentTypes && candidate.employmentTypes.length > 0 && (
          <span>· {candidate.employmentTypes.map(formatEnum).join(", ")}</span>
        )}

        {candidate.location && <span>· {formatEnum(candidate.location)}</span>}
        <span>· {formatExperience(candidate.experience?.toString() || null)}</span>
        {candidate.category && <span>· {candidate.category.name}</span>}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {candidate.skills.map((skill) => (
          <span
            key={skill.id}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/vacancies?skills=${skill.id}`);
            }}
          >
            <Badge variant="secondary" className="hover:bg-primary/20 transition-colors">
              {skill.name}
            </Badge>
          </span>
        ))}
      </div>

      <ExpandableText text={candidate.about ?? ""} className="text-sm" />
    </Link>
  );
};

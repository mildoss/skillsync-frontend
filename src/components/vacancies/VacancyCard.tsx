"use client";

import { Badge } from "@/components/ui/badge";
import { Vacancy } from "@/types/vacancies";
import Link from "next/link";
import { formatSalary, formatExperience, formatDate, formatEnum } from "@/lib/utils";
import { ExpandableText } from "@/components/ui/expandable-text";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { useRouter } from "next/navigation";

type VacancyCardProps = {
  vacancy: Vacancy;
};

export const VacancyCard = ({ vacancy }: VacancyCardProps) => {
  const router = useRouter();

  return (
    <Link
      href={`/vacancies/${vacancy.id}`}
      className="bg-card hover:border-primary/50 block rounded-lg border p-4 shadow-sm transition-colors sm:p-6"
    >
      <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex gap-3 sm:gap-4">
          <CustomAvatar
            imageUrl={vacancy.company.logoUrl}
            fallbackText={vacancy.company.name}
            size="sm"
          />

          <div className="flex flex-col">
            <h2 className="text-primary text-lg leading-tight font-semibold sm:text-xl">
              {vacancy.title}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-muted-foreground text-sm font-medium">{vacancy.company.name}</p>
              <span className="text-muted-foreground hidden text-xs sm:inline">•</span>
              <span className="text-muted-foreground hidden text-xs sm:inline">
                {formatDate(vacancy.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 sm:text-right">
          <span className="text-success text-base font-bold sm:text-lg">
            {formatSalary(vacancy.salaryMin, vacancy.salaryMax, vacancy.currency)}
          </span>

          <p className="text-muted-foreground mt-0.5 text-xs sm:hidden">
            {formatDate(vacancy.createdAt)}
          </p>
        </div>
      </div>

      <div className="text-muted-foreground mb-4 flex flex-wrap gap-x-2 gap-y-1 text-xs sm:text-sm">
        <span className="text-foreground font-semibold">{formatEnum(vacancy.type)}</span>
        {vacancy.location && <span>· {formatEnum(vacancy.location)}</span>}
        <span>· {formatExperience(vacancy.experience)}</span>
        {vacancy.category && <span>· {vacancy.category.name}</span>}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {vacancy.skills.map((skill) => (
          <span
            key={skill.id}
            onClick={(e) => {
              e.preventDefault(); // Запрещаем переход по большой ссылке карточки
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

      <ExpandableText text={vacancy.description} className="text-sm" />
    </Link>
  );
};
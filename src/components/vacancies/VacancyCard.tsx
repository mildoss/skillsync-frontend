"use client";

import { Badge } from "@/components/ui/badge";
import { Vacancy } from "@/types/vacancies";
import Link from "next/link";
import { formatSalary, formatExperience, formatDate } from "@/lib/utils";
import { ExpandableText } from "@/components/ui/expandable-text";

type VacancyCardProps = {
  vacancy: Vacancy;
};

export const VacancyCard = ({ vacancy }: VacancyCardProps) => {
  return (
    <Link
      href={`/vacancies/${vacancy.id}`}
      className="bg-card hover:border-primary/50 block rounded-lg border p-4 shadow-sm transition-colors sm:p-6"
    >
      <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex gap-3 sm:gap-4">
          <div className="bg-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white sm:h-12 sm:w-12">
            {vacancy.company.name[0].toUpperCase()}
          </div>

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
        <span className="text-foreground font-semibold">{vacancy.type}</span>
        {vacancy.location && <span>· {vacancy.location}</span>}
        <span>· {formatExperience(vacancy.experience)}</span>
        {vacancy.category && <span>· {vacancy.category.name}</span>}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {vacancy.skills.map((skill) => (
          <Link
            key={skill.id}
            href={`/vacancies?skills=${skill.id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Badge variant="secondary" className="hover:bg-primary/20 transition-colors">
              {skill.name}
            </Badge>
          </Link>
        ))}
      </div>

        <ExpandableText text={vacancy.description} className="text-sm" />
    </Link>
  );
};
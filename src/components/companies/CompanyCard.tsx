"use client";

import { Companies } from "@/types/companies";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Briefcase, Users } from "lucide-react";

export const CompanyCard = ({company}: {company: Companies}) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/companies/${company.slug || company.id}`)}
      className="bg-card hover:border-primary/50 flex cursor-pointer flex-col rounded-xl border p-6 shadow-sm transition-colors"
    >
      <div className="flex items-start gap-4">
        {company.logoUrl ? (
          <Image
            src={company.logoUrl}
            alt={company.name}
            width={64}
            height={64}
            className="size-16 shrink-0 rounded-lg object-cover shadow-sm"
          />
        ) : (
          <div className="bg-muted-foreground flex size-16 shrink-0 items-center justify-center rounded-lg text-2xl font-bold text-white shadow-sm">
            {company.name[0].toUpperCase()}
          </div>
        )}

        <div className="flex flex-col">
          <h2 className="text-primary line-clamp-1 text-lg leading-tight font-bold">
            {company.name}
          </h2>
          <Badge variant="secondary" className="mt-2 w-fit px-2 py-0.5 text-[10px]">
            {company.companyType}
          </Badge>
        </div>
      </div>

      <p className="text-muted-foreground mt-4 flex-1 text-sm line-clamp-2">
        {company.description || "No description provided."}
      </p>

      <div className="mt-6 flex items-center gap-4 border-t pt-4">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <Briefcase className="text-muted-foreground size-4 shrink-0" />
          <span className={company._count.vacancies > 0 ? "text-success" : "text-muted-foreground"}>
            {company._count.vacancies} vacancies
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <Users className="text-muted-foreground size-4 shrink-0" />
          <span className="text-muted-foreground">{company._count.employees} employees</span>
        </div>
      </div>
    </div>
  );
}
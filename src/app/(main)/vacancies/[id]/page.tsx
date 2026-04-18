import { getVacancy } from "@/lib/api";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { StickyActionCard } from "@/components/shared/StickyActionCard";
import { TagsSection } from "@/components/shared/TagsSection";
import { BackButton } from "@/components/shared/BackButton";
import { formatExperience, formatSalary, formatDate, formatEnum } from "@/lib/utils";
import { Briefcase, Globe2, Clock, CalendarDays } from "lucide-react";

type VacancyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VacancyPage({ params }: VacancyPageProps) {
  const { id } = await params;

  let vacancy;
  try {
    vacancy = await getVacancy(id);
  } catch {
    notFound();
  }

  return (
    <div className="relative container mx-auto px-4 py-8">
      <BackButton fallbackHref="/vacancies" label="Back to vacancies" />

      <PageHeader
        title={vacancy.title}
        subtitle={vacancy.company.name}
        imageUrl={vacancy.company.logoUrl}
        fallbackLetter={vacancy.company.name[0]}
        badges={[vacancy.category?.name, vacancy.location, vacancy.type]}
      />

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <section className="bg-card rounded-xl border p-6 shadow-sm sm:p-8">
            <h2 className="mb-4 text-xl font-bold tracking-tight">Job Description</h2>
            <div className="text-muted-foreground text-base leading-relaxed whitespace-pre-wrap">
              {vacancy.description}
            </div>
          </section>

          {(vacancy.skills?.length > 0 || vacancy.languages?.length > 0) && (
            <section className="bg-card rounded-xl border p-6 shadow-sm sm:p-8">
              <h2 className="mb-2 text-xl font-bold tracking-tight">Requirements</h2>
              <TagsSection title="Skills" tags={vacancy.skills} />
              <TagsSection title="Languages" tags={vacancy.languages} />
            </section>
          )}
        </div>

        <div className="lg:col-span-1">
          <StickyActionCard
            primaryText={formatSalary(vacancy.salaryMin, vacancy.salaryMax, vacancy.currency)}
            primarySubtext="Before taxes"
            actionButtonLabel="Apply for job"
            metaItems={[
              {
                icon: <Briefcase className="size-5" />,
                label: "Experience",
                value: formatExperience(vacancy.experience),
              },
              {
                icon: <Globe2 className="size-5" />,
                label: "Location",
                value: formatEnum(vacancy.location) || "Not specified",
              },
              {
                icon: <Clock className="size-5" />,
                label: "Format",
                value: formatEnum(vacancy.type),
              },
              {
                icon: <CalendarDays className="size-5" />,
                label: "Posted",
                value: formatDate(vacancy.createdAt),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

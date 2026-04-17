import { getCompany } from "@/lib/api";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { CompanyVacancies } from "@/components/companies/CompanyVacancies";
import { CompanyTeam } from "@/components/companies/CompanyTeam";
import { StickyActionCard } from "@/components/shared/StickyActionCard";
import { BackButton } from "@/components/shared/BackButton";
import { Globe, Briefcase, Users } from "lucide-react";

type CompanyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { id } = await params;

  let company;
  try {
    company = await getCompany(id);
  } catch {
    notFound();
  }

  const vacancyCount = company.vacancies.length;
  const vacancyBadgeText =
    vacancyCount === 1 ? "1 active vacancy" : `${vacancyCount} active vacancies`;

  return (
    <div className="relative container mx-auto px-4 py-8">
      <BackButton fallbackHref="/companies" label="Back to companies" />

      <PageHeader
        title={company.name}
        subtitle={company.companyType}
        imageUrl={company.logoUrl}
        fallbackLetter={company.name[0]}
        badges={[vacancyBadgeText]}
      />

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <section className="bg-card rounded-xl border p-6 shadow-sm sm:p-8">
            <h2 className="mb-4 text-xl font-bold tracking-tight">About {company.name}</h2>
            <div className="text-muted-foreground text-base leading-relaxed whitespace-pre-wrap">
              {company.description || "No description provided."}
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-xl font-bold tracking-tight">Open Vacancies</h2>
            <CompanyVacancies vacancies={company.vacancies} />
          </section>

          <CompanyTeam employees={company.employees} />
        </div>

        <div className="lg:col-span-1">
          <StickyActionCard
            primaryText={company.name}
            primarySubtext={company.companyType}
            actionButtonLabel="Visit Website"
            actionHref={company.websiteUrl || "#"}
            metaItems={[
              {
                icon: <Globe className="size-5" />,
                label: "Website",
                value: company.websiteUrl ? (
                  <a
                    href={company.websiteUrl}
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    {new URL(company.websiteUrl).hostname}
                  </a>
                ) : (
                  "Not specified"
                ),
              },
              {
                icon: <Briefcase className="size-5" />,
                label: "Vacancies",
                value: `${company.vacancies.length} active ads`,
              },
              {
                icon: <Users className="size-5" />,
                label: "Team size",
                value: `${company.employees.length} members on SkillSync`,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

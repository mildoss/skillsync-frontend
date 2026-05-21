import { getUser } from "@/lib/api";
import { getMe, getMyVacancies } from "@/lib/server-api";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { StickyActionCard } from "@/components/shared/StickyActionCard";
import { TagsSection } from "@/components/shared/TagsSection";
import { BackButton } from "@/components/shared/BackButton";
import { formatEnum, formatExperience } from "@/lib/utils";
import { Briefcase, FileText, Globe2, MonitorSmartphone } from "lucide-react";
import { Vacancy } from "@/types/vacancies";
import { InviteButton } from "@/components/applications/InviteButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type CandidatePageProps = {
  params: Promise<{ id: string }>;
};

export default async function CandidatePage({ params }: CandidatePageProps) {
  const { id } = await params;

  const [candidate, user] = await Promise.all([
    getUser(id).catch(() => null),
    getMe().catch(() => null),
  ]);

  if (!candidate) {
    notFound();
  }

  let myVacancies: Vacancy[] = [];
  if (user?.role === "EMPLOYER" && user.companyId) {
    myVacancies = await getMyVacancies().catch(() => []);
  }

  return (
    <div className="relative container mx-auto px-4 py-8">
      <BackButton fallbackHref="/candidates" label="Back to candidates" />

      <PageHeader
        title={candidate.position || "Position not specified"}
        subtitle={candidate.name}
        imageUrl={candidate.avatarUrl}
        fallbackLetter={candidate.name[0]}
        badges={[candidate.category?.name, candidate.location]}
      />

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          {candidate.about && (
            <section className="bg-card rounded-xl border p-6 shadow-sm sm:p-8">
              <h2 className="mb-4 text-xl font-bold tracking-tight">About candidate</h2>
              <div className="text-muted-foreground text-base leading-relaxed whitespace-pre-wrap">
                {candidate.about}
              </div>
            </section>
          )}

          {(candidate.skills?.length > 0 || candidate.languages?.length > 0) && (
            <section className="bg-card rounded-xl border p-6 shadow-sm sm:p-8">
              <h2 className="mb-2 text-xl font-bold tracking-tight">Expertise</h2>

              <TagsSection title="Skills" tags={candidate.skills} />

              <TagsSection title="Languages" tags={candidate.languages} />
            </section>
          )}

          {candidate.cvUrl && (
            <section className="bg-card rounded-xl border p-6 shadow-sm sm:p-8">
              <h2 className="mb-4 text-xl font-bold tracking-tight">Resume</h2>
              <Button variant="outline" asChild>
                <Link href={candidate.cvUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 size-4" />
                  View Candidate CV
                </Link>
              </Button>
            </section>
          )}
        </div>

        <div className="lg:col-span-1">
          <StickyActionCard
            primaryText={formatExperience(candidate.experience?.toString() || null)}
            primarySubtext="Total experience"
            actionButtonLabel="Invite to vacancy"
            actionNode={
              <InviteButton
                candidateId={candidate.id}
                candidateName={candidate.name}
                user={user}
                myVacancies={myVacancies}
              />
            }
            metaItems={[
              {
                icon: <Briefcase className="size-5" />,
                label: "Employment",
                value:
                  candidate.employmentTypes?.length > 0
                    ? candidate.employmentTypes.map(formatEnum).join(", ")
                    : "Not specified",
              },
              {
                icon: <Globe2 className="size-5" />,
                label: "Location",
                value: formatEnum(candidate.location) || "Not specified",
              },
              {
                icon: <MonitorSmartphone className="size-5" />,
                label: "Work format",
                value:
                  candidate.workFormats?.length > 0
                    ? candidate.workFormats.map(formatEnum).join(", ")
                    : "Not specified",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
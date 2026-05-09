import { getVacancy } from "@/lib/api";
import { getMe, getVacancyApplications } from "@/lib/server-api";
import { notFound, redirect } from "next/navigation";
import { RequireCompany } from "@/components/companies/RequireCompany";
import { ChevronLeft, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HrApplicationCard } from "@/components/applications/HrApplicationCard";

type Params = Promise<{ id: string }>;

export default async function VacancyApplicationsPage({ params }: { params: Params }) {
  const { id } = await params;
  const user = await getMe();

  if (!user || user.role !== "EMPLOYER") {
    redirect("/login");
  }

  const [vacancy, applications] = await Promise.all([
    getVacancy(id).catch(() => null),
    getVacancyApplications(id).catch(() => []),
  ]);

  if (!vacancy || vacancy.company.id !== user.companyId) {
    notFound();
  }

  return (
    <RequireCompany user={user}>
      <div className="mx-auto max-w-5xl py-6">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground mb-6 -ml-2">
          <Link href="/my-vacancies">
            <ChevronLeft className="mr-1 size-4" /> Back to My Vacancies
          </Link>
        </Button>

        <div className="mb-8 flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
            <p className="text-muted-foreground mt-2">
              Reviewing applicants for{" "}
              <span className="text-foreground font-semibold">{vacancy.title}</span>
            </p>
          </div>
          <div className="bg-muted text-muted-foreground flex items-center gap-2 rounded-lg px-4 py-2 font-medium">
            <Users className="size-5" />
            {applications.length} Total Applicants
          </div>
        </div>

        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="border-border text-muted-foreground rounded-xl border border-dashed py-24 text-center">
              No candidates have applied to this vacancy yet.
            </div>
          ) : (
            applications.map((app) => <HrApplicationCard key={app.id} application={app} />)
          )}
        </div>
      </div>
    </RequireCompany>
  );
}

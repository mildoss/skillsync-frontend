import { getMe, getCategories, getSkills, getLanguages, getDomains, getVacancy } from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import { RequireCompany } from "@/components/companies/RequireCompany";
import { VacancyForm } from "@/components/vacancies/VacancyForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Params = Promise<{ id: string }>;

export default async function EditVacancyPage({ params }: { params: Params }) {
  const { id } = await params;
  const user = await getMe();

  if (!user) redirect("/login");

  const [vacancy, categories, skills, languages, domains] = await Promise.all([
    getVacancy(id),
    getCategories(),
    getSkills(),
    getLanguages(),
    getDomains(),
  ]);

  if (!vacancy || vacancy.company.id !== user.companyId) {
    return notFound();
  }

  return (
    <RequireCompany user={user}>
      <div className="mx-auto max-w-5xl py-6">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground mb-6 -ml-2">
          <Link href="/my-vacancies">
            <ChevronLeft className="mr-1 size-4" /> Back to My Vacancies
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Edit Vacancy</h1>
          <p className="text-muted-foreground mt-2">
            Update the details of your job post. Changes will be visible immediately.
          </p>
        </div>

        <VacancyForm
          initialData={vacancy}
          categories={categories}
          skills={skills}
          languages={languages}
          domains={domains}
        />
      </div>
    </RequireCompany>
  );
}

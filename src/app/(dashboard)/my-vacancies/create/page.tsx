import { getMe, getCategories, getSkills, getLanguages, getDomains } from "@/lib/api";
import { redirect } from "next/navigation";
import { RequireCompany } from "@/components/companies/RequireCompany";
import { VacancyForm } from "@/components/vacancies/VacancyForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CreateVacancyPage() {
  const user = await getMe();

  if (!user) redirect("/login");

  const [categories, skills, languages, domains] = await Promise.all([
    getCategories(),
    getSkills(),
    getLanguages(),
    getDomains(),
  ]);

  return (
    <RequireCompany user={user}>
      <div className="mx-auto max-w-5xl py-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2 text-muted-foreground">
          <Link href="/my-vacancies">
            <ChevronLeft className="mr-1 size-4" /> Back to Vacancies
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create New Vacancy</h1>
          <p className="text-muted-foreground mt-2">
            Fill out the form below to post a new job opportunity for your company.
          </p>
        </div>

        {user.companyId && (
          <VacancyForm
            categories={categories}
            skills={skills}
            languages={languages}
            domains={domains}
          />
        )}
      </div>
    </RequireCompany>
  );
}
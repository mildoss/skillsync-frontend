import { getMe, getMyVacancies } from "@/lib/api";
import { redirect } from "next/navigation";
import { RequireCompany } from "@/components/companies/RequireCompany";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { VacancyCard } from "@/components/vacancies/VacancyCard";

export default async function MyVacanciesPage() {
  const user = await getMe();
  if (!user) redirect("/login");

  const myVacancies = await getMyVacancies();

  return (
    <RequireCompany user={user}>
      <div className="mx-auto max-w-5xl py-6">
        <div className="flex flex-col justify-between gap-4 border-b pb-8 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Vacancies</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your company&#39;s job postings.
            </p>
          </div>
          <Button asChild size="lg" className="h-12 px-6 shadow-sm">
            <Link href="/my-vacancies/create">
              <Plus className="mr-2 size-5" /> Create Vacancy
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6">
          {myVacancies.length > 0 ? (
            myVacancies.map((vacancy) => (
              <div key={vacancy.id} className="group relative">
                <VacancyCard vacancy={vacancy} />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/my-vacancies/${vacancy.id}`}>Edit</Link>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
              <h3 className="text-xl font-semibold">No vacancies found</h3>
              <p className="text-muted-foreground mt-2 max-w-xs">
                You haven&#39;t posted any jobs yet. Start by creating your first vacancy.
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/my-vacancies/create">Create your first vacancy</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </RequireCompany>
  );
}

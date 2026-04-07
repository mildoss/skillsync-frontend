import { VacancyCard } from "@/components/vacancies/VacancyCard";
import { VacancyFilters } from "@/components/vacancies/VacancyFilters";
import { Button } from "@/components/ui/button";
import { getCategories, getDomains, getLanguages, getSkills, getVacancies } from "@/lib/api";

type VacanciesPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function VacanciesPage({searchParams}: VacanciesPageProps) {
  const resolvedSearchParams = await searchParams;
  const queryParams = new URLSearchParams();

  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, String(value));
    }
  });

  const [vacancies, categories, skills, languages, domains] = await Promise.all([
    getVacancies(queryParams),
    getCategories(),
    getSkills(),
    getLanguages(),
    getDomains()
  ]);

  return (
    <div className="relative container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Search for vacancies</h1>
        <p className="text-muted-foreground mt-2">Find your dream job among hundreds of offers</p>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-4">
        <div className="flex flex-col gap-4 lg:col-span-3">
          {vacancies.data.length === 0 ? (
            <div className="bg-card rounded-lg border py-12 text-center">
              <h3 className="text-lg font-medium">No vacancies found</h3>
              <p className="text-muted-foreground mt-1 text-sm">Try changing filters</p>
            </div>
          ) : (
            vacancies.data.map((vacancy) => <VacancyCard key={vacancy.id} vacancy={vacancy} />)
          )}
        </div>

        <div className="sticky top-24 hidden lg:col-span-1 lg:block">
          <VacancyFilters
            categories={categories}
            skills={skills}
            domains={domains}
            languages={languages}
          />
        </div>
      </div>

      <div className="pointer-events-none fixed right-0 bottom-6 left-0 z-40 flex justify-center lg:hidden">
        <Button size="lg" className="pointer-events-auto rounded-full px-8 shadow-2xl">
          Filters ({searchParams ? Object.keys(searchParams).length : 0})
        </Button>
      </div>
    </div>
  );
}

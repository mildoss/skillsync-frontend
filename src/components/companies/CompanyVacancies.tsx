import { Vacancy } from "@/types/vacancies";
import { VacancyCard } from "@/components/vacancies/VacancyCard";

export const CompanyVacancies = ({vacancies}: {vacancies: Vacancy[]}) => {
  if (!vacancies || vacancies.length === 0) {
    return (
      <div className="bg-muted/30 rounded-xl border border-dashed py-12 text-center">
        <p className="text-muted-foreground">No active vacancies at the moment.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {vacancies.map((vacancy) => (
        <VacancyCard key={vacancy.id} vacancy={vacancy} />
      ))}
    </div>
  );
}
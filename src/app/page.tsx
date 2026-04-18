import { getCategories, getVacancies } from "@/lib/api";
import { Hero } from "@/components/home/Hero";
import { CategoryCard } from "@/components/home/CategoryCard";
import { VacancyCard } from "@/components/vacancies/VacancyCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const [categories, vacanciesResponse] = await Promise.all([
    getCategories(),
    getVacancies(new URLSearchParams({ limit: "5" })),
  ]);

  return (
    <div className="flex flex-col gap-20 pb-20">
      <Hero />

      <section className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Explore by Category
          </h2>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href="/vacancies">
              All categories <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Latest Opportunities
          </h2>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href="/vacancies">
              View all jobs <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {vacanciesResponse.data.map((vacancy) => (
            <VacancyCard key={vacancy.id} vacancy={vacancy} />
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Button variant="outline" asChild className="w-full">
            <Link href="/vacancies">View all jobs</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

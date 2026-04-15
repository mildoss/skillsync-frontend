import { getCompanies } from "@/lib/api";
import { CompanySearch } from "@/components/companies/CompanySearch";
import { CompanyCard } from "@/components/companies/CompanyCard";
import { Pagination } from "@/components/ui/pagination";

type CompaniesPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const resolvedSearchParams = await searchParams;
  const queryParams = new URLSearchParams();

  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, String(value));
    }
  });

  const companiesResponse = await getCompanies(queryParams);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Top IT Companies</h1>
        <p className="text-muted-foreground mt-3 mb-8 max-w-2xl text-lg">
          Discover the best places to work. Search by company name and explore their open vacancies
          and team size.
        </p>
        <CompanySearch />
      </div>

      {companiesResponse.data.length === 0 ? (
        <div className="bg-card rounded-xl border py-20 text-center shadow-sm">
          <h3 className="text-xl font-semibold">No companies found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {companiesResponse.data.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <Pagination meta={companiesResponse.meta} />
      </div>
    </div>
  );
}
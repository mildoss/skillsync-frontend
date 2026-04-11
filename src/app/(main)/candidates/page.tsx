import { Button } from "@/components/ui/button";
import { getCategories, getLanguages, getSkills, getUsers } from "@/lib/api";
import { ActiveFiltersChips } from "@/components/ui/filters/ActiveFiltersChips";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Pagination } from "@/components/ui/pagination";
import { CandidateCard } from "@/components/candidates/CandidateCard";
import { CandidateFilters } from "@/components/candidates/CandidateFilters";

type CandidatesPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CandidatesPage({searchParams}: CandidatesPageProps) {
  const resolvedSearchParams = await searchParams;
  const queryParams = new URLSearchParams();

  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, String(value));
    }
  });

  const [candidates, categories, skills, languages] = await Promise.all([
    getUsers(queryParams),
    getCategories(),
    getSkills(),
    getLanguages(),
  ]);

  return (
    <div className="relative container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Search for candidates</h1>
        <p className="text-muted-foreground my-2">Find the right people for your company among hundreds of resumes</p>
        <ActiveFiltersChips
          categories={categories}
          skills={skills}
          languages={languages}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-4">
        <div className="flex flex-col gap-4 lg:col-span-3">
          {candidates.data.length === 0 ? (
            <div className="bg-card rounded-lg border py-12 text-center">
              <h3 className="text-lg font-medium">No candidates found</h3>
              <p className="text-muted-foreground mt-1 text-sm">Try changing filters</p>
            </div>
          ) : (
            candidates.data.map((user) => <CandidateCard key={user.id} candidate={user} />)
          )}
        </div>

        <div className="sticky top-24 hidden lg:col-span-1 lg:block">
          <CandidateFilters
            categories={categories}
            skills={skills}
            languages={languages}
          />
        </div>
      </div>

      <Pagination meta={candidates.meta} />

      <div className="pointer-events-none fixed right-0 bottom-6 left-0 z-40 mb-15 flex justify-center lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="pointer-events-auto cursor-pointer rounded-full px-8 shadow-2xl"
            >
              Filters ({Object.keys(resolvedSearchParams).filter((k) => k !== "page").length})
            </Button>
          </SheetTrigger>

          <SheetContent side="bottom" className="flex h-[85vh] flex-col rounded-t-2xl px-0 pb-0">
            <SheetHeader className="border-b px-6 py-4 text-left">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <CandidateFilters
                categories={categories}
                skills={skills}
                languages={languages}
              />
            </div>

            <div className="bg-background border-t p-4 pb-8">
              <SheetClose asChild>
                <Button className="h-12 w-full text-lg">Show results</Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

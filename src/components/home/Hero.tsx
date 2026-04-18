import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="bg-primary/5 border-b py-36 sm:py-40 min-h-screen">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
          Find your <span className="text-primary">dream IT job</span> today
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          SkillSync connects top tech talent with innovative companies.
          Start your next chapter in a team that values your skills.
        </p>

        <div className="mt-10 max-w-3xl mx-auto">
          <form action="/vacancies" className="flex w-full items-center gap-2 bg-background p-2 sm:p-3 rounded-2xl shadow-xl border">
            <Search className="ml-3 size-6 text-muted-foreground hidden sm:block shrink-0" />
            <Input
              name="search"
              placeholder="Position, skills, or company name..."
              className="h-12 sm:h-14 text-lg border-0 shadow-none focus-visible:ring-0"
            />
            <Button type="submit" size="lg" className="h-12 sm:h-14 px-8 text-lg cursor-pointer">
              Search
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span>Trending:</span>
            <Link href="/vacancies?search=JavaScript" className="hover:text-primary transition-colors">JavaScript</Link>
            <Link href="/vacancies?search=Python" className="hover:text-primary transition-colors">Python</Link>
            <Link href="/vacancies?search=Java" className="hover:text-primary transition-colors">Java</Link>
          </div>
        </div>
      </div>
    </section>
  );
};
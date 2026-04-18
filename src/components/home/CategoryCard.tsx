import Link from "next/link";
import { Dictionaries } from "@/types/dictionaries";
import { Monitor, Server, Paintbrush, ShieldCheck, Terminal, Code } from "lucide-react";

const getCategoryIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case "frontend":
      return <Monitor className="size-8" />;
    case "backend":
      return <Server className="size-8" />;
    case "design":
      return <Paintbrush className="size-8" />;
    case "qa":
      return <ShieldCheck className="size-8" />;
    case "devops":
      return <Terminal className="size-8" />;
    default:
      return <Code className="size-8" />;
  }
};

export const CategoryCard = ({ category }: { category: Dictionaries }) => {
  return (
    <Link
      href={`/vacancies?categoryId=${category.id}`}
      className="group bg-card hover:border-primary/50 flex flex-col items-center justify-center gap-4 rounded-2xl border p-6 text-center transition-all hover:shadow-md"
    >
      <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground rounded-xl p-4 transition-colors">
        {getCategoryIcon(category.name)}
      </div>
      <span className="text-foreground font-semibold">{category.name}</span>
    </Link>
  );
};

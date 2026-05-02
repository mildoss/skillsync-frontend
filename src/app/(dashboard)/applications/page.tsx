import { getMe, getMyApplications } from "@/lib/api";
import { redirect } from "next/navigation";
import { ApplicantRequestCard } from "@/components/applications/ApplicantRequestCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search } from "lucide-react";

export default async function ApplicationsPage() {
  const user = await getMe();

  if (!user) redirect("/login");
  if (user.role === "EMPLOYER") redirect("/my-vacancies");

  const applications = await getMyApplications();

  return (
    <div className="mx-auto max-w-4xl py-6">
      <div className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="text-muted-foreground mt-2">Track the status of jobs you&#39;ve applied for.</p>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-24 text-center">
          <div className="bg-primary/10 text-primary mb-4 rounded-full p-4">
            <Search className="size-8" />
          </div>
          <h3 className="text-xl font-semibold">No applications yet</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            You haven&#39;t applied to any jobs. Explore our catalog to find your next career
            opportunity.
          </p>
          <Button asChild className="mt-6" size="lg">
            <Link href="/vacancies">Explore Vacancies</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((app) => (
            <ApplicantRequestCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}

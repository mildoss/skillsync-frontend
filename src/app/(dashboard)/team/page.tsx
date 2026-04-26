import { getMe, getCompany } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RequireCompany } from "@/components/companies/RequireCompany";
import { getCompanyRequestsAction } from "@/actions/company";
import { TeamRequestsList } from "@/components/companies/TeamRequestsList";
import { ActiveTeamList } from "@/components/companies/ActiveTeamList";
import { TeamRequest } from "@/types/companies";

export default async function TeamPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access-token")?.value;
  const user = await getMe(token!);

  if (!user) redirect("/login");

  if (user.companyId && user.companyRole !== "OWNER") {
    redirect("/company");
  }

  let requests: TeamRequest[] = [];
  let company = null;

  if (user.companyId) {
    company = await getCompany(user.companyId);
    const res = await getCompanyRequestsAction(user.companyId);
    if (res.data) requests = res.data;
  }

  const activeEmployees = company?.employees.filter((emp) => emp.id !== user.id) || [];

  return (
    <RequireCompany user={user}>
      <div className="mx-auto max-w-4xl py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your recruiters and pending join requests.
          </p>
        </div>

        <div className="space-y-8">
          {requests.length > 0 && (
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Pending Requests ({requests.length})</h2>
              <TeamRequestsList initialRequests={requests} companyId={user.companyId!} />
            </div>
          )}

          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Active Recruiters ({activeEmployees.length})</h2>
            {activeEmployees.length === 0 ? (
              <div className="border-border text-muted-foreground rounded-xl border border-dashed py-8 text-center">
                You don&#39;t have any recruiters in your team yet.
              </div>
            ) : (
              <ActiveTeamList employees={activeEmployees} companyId={user.companyId!} />
            )}
          </div>
        </div>
      </div>
    </RequireCompany>
  );
}

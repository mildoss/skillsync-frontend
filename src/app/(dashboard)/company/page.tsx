import { getMe, getCompany } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RequireCompany } from "@/components/companies/RequireCompany";
import { UpdateCompanyForm } from "@/components/companies/UpdateCompanyForm";

export default async function MyCompanyPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access-token")?.value;
  const user = await getMe(token!);

  if (!user) redirect("/login");

  let company = null;

  if (user.companyId) {
    try {
      company = await getCompany(user.companyId);
    } catch (error) {
      console.error("Failed to fetch company:", error);
    }
  }

  const isReadOnly = user.companyRole !== "OWNER";

  return (
    <RequireCompany user={user}>
      {company && (
        <div className="mx-auto max-w-4xl py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">My Company</h1>
            <p className="text-muted-foreground mt-2">
              Manage your company identity, description and links.
            </p>
          </div>

          <div className="bg-card rounded-xl border p-6 shadow-sm sm:p-8">
            <UpdateCompanyForm company={company} isReadOnly={isReadOnly} />
          </div>
        </div>
      )}
    </RequireCompany>
  );
}

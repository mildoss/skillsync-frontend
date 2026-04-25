import { getMe } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EmployerProfileForm } from "@/components/profile/EmployerProfileForm";
import { ApplicantProfileForm } from "@/components/profile/ApplicantProfileForm";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access-token")?.value;
  const user = await getMe(token!);

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-4xl py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          {user.role === "EMPLOYER"
            ? "Update your personal details. Candidates will see this when you interact with them."
            : "Fill out your resume to apply for top jobs and get noticed by recruiters."}
        </p>
      </div>

      {user.role === "EMPLOYER" ? (
        <EmployerProfileForm user={user} />
      ) : (
        <ApplicantProfileForm user={user} />
      )}
    </div>
  );
}

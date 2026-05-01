import { getCategories, getLanguages, getMe, getSkills } from "@/lib/api";
import { redirect } from "next/navigation";
import { EmployerProfileForm } from "@/components/profile/EmployerProfileForm";
import { ApplicantProfileForm } from "@/components/profile/ApplicantProfileForm";
import { Dictionaries } from "@/types/dictionaries";

export default async function ProfilePage() {
  const user = await getMe();
  let categories: Dictionaries[] = [];
  let skills: Dictionaries[] = [];
  let languages: Dictionaries[] = [];

  if (!user) redirect("/login");


  if (user.role === "APPLICANT") {
    [categories, skills, languages] = await Promise.all([
      getCategories(),
      getSkills(),
      getLanguages(),
    ]);
  }

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
        <ApplicantProfileForm
          user={user}
          categories={categories}
          skills={skills}
          languages={languages}
        />
      )}
    </div>
  );
}

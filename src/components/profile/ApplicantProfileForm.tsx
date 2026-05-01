"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ApplicantProfileData,
  ApplicantProfileFormValues,
  UpdateApplicantProfileInput,
  updateApplicantProfileSchema,
} from "@/lib/validation/user";
import { updateUserAction } from "@/actions/user";
import { Dictionaries } from "@/types/dictionaries";
import { User } from "@/types/users";
import { EXPERIENCE_OPTIONS, LOCATION_OPTIONS, WORK_FORMATS, EMPLOYMENT_TYPES } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CustomAvatar } from "@/components/shared/CustomAvatar";

type ApplicantProfileFormProps = {
  user: User;
  categories: Dictionaries[];
  skills: Dictionaries[];
  languages: Dictionaries[];
};

export const ApplicantProfileForm = ({
  user,
  categories,
  skills,
  languages,
}: ApplicantProfileFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ApplicantProfileFormValues, unknown, ApplicantProfileData>({
    resolver: zodResolver(updateApplicantProfileSchema),
    defaultValues: {
      name: user.name ?? "",
      position: user.position ?? "",
      categoryId: user.category?.id ?? "",
      experience: user.experience ?? "",
      location: user.location ?? "",
      about: user.about ?? "",
      skills: user.skills?.map((s) => s.id) ?? [],
      languages: user.languages?.map((l) => l.id) ?? [],
      workFormats: user.workFormats ?? [],
      employmentTypes: user.employmentTypes ?? [],
      avatarUrl: user.avatarUrl ?? "",
      cvUrl: user.cvUrl ?? "",
      isActive: user.isActive ?? true,
    },
  });

  const avatarUrl = watch("avatarUrl");
  const name = watch("name");
  const position = watch("position");

  const onSubmit = (data: UpdateApplicantProfileInput) => {
    startTransition(async () => {
      const res = await updateUserAction(data);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Profile updated successfully!");
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-card space-y-8 rounded-xl border p-6 shadow-sm sm:p-8">
        <div className="bg-card space-y-4 rounded-xl border p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">Visibility settings</h2>
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              {...register("isActive")}
              className="accent-primary size-5"
            />
            <div>
              <p className="font-medium">Active and looking for a job</p>
              <p className="text-muted-foreground text-xs">
                When disabled, recruiters won&#39;t see your profile in search results or catalog.
              </p>
            </div>
          </label>
        </div>

        <div className="flex items-center gap-6 border-b pb-6">
          <CustomAvatar imageUrl={avatarUrl} fallbackText={name || "?"} size="lg" />
          <div>
            <h3 className="text-xl font-bold">{name || "Your Name"}</h3>
            <p className="text-muted-foreground font-medium">{position || "Your Profession"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Full Name *</label>
            <Input placeholder="John Doe" {...register("name")} className="h-11" />
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Avatar URL</label>
            <Input placeholder="https://..." {...register("avatarUrl")} className="h-11" />
            {errors.avatarUrl && (
              <p className="text-destructive text-xs">{errors.avatarUrl.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card space-y-6 rounded-xl border p-6 shadow-sm">
        <h2 className="text-xl font-bold">Professional Details</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Primary Position *</label>
            <Input
              placeholder="e.g. Frontend Developer"
              {...register("position")}
              className="h-11"
            />
            {errors.position && (
              <p className="text-destructive text-xs">{errors.position.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Category *</label>
            <select
              {...register("categoryId")}
              className="border-input focus:ring-primary flex h-11 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2"
            >
              <option value="">Select category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-destructive text-xs">{errors.categoryId.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Experience (Years)</label>
            <select
              {...register("experience")}
              className="border-input focus:ring-primary flex h-11 w-full rounded-lg border bg-transparent px-3 text-sm outline-none focus:ring-2"
            >
              <option value="">No experience</option>
              {EXPERIENCE_OPTIONS.filter((e) => e.value !== "0").map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Location</label>
            <select
              {...register("location")}
              className="border-input focus:ring-primary flex h-11 w-full rounded-lg border bg-transparent px-3 text-sm outline-none focus:ring-2"
            >
              <option value="">Not specified</option>
              {LOCATION_OPTIONS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>


      <div className="bg-card space-y-6 rounded-xl border p-6 shadow-sm">
        <h2 className="text-xl font-bold">About & Resume</h2>

        <div className="space-y-1">
          <label className="text-sm font-medium">About Me</label>
          <textarea
            {...register("about")}
            className="border-input focus-visible:ring-ring flex min-h-48 w-full rounded-lg border bg-transparent px-4 py-3 text-sm outline-none focus-visible:ring-2"
            placeholder="Tell recruiters about your background, achievements, and goals..."
          />
          {errors.about && <p className="text-destructive text-xs">{errors.about.message}</p>}
        </div>

        <div className="space-y-1 pt-2">
          <label className="text-sm font-medium">CV / Resume URL (Optional)</label>
          <Input
            placeholder="https://drive.google.com/..."
            {...register("cvUrl")}
            className="h-11"
          />
          {errors.cvUrl && <p className="text-destructive text-xs">{errors.cvUrl.message}</p>}
        </div>
      </div>

      <div className="bg-card space-y-6 rounded-xl border p-6 shadow-sm">
        <h2 className="text-xl font-bold">Preferences</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium">Work Format</label>
          <div className="flex flex-wrap gap-4">
            {WORK_FORMATS.map((format) => (
              <label key={format.value} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={format.value}
                  {...register("workFormats")}
                  className="accent-primary size-4"
                />
                <span>{format.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <label className="text-sm font-medium">Employment Type</label>
          <div className="flex flex-wrap gap-4">
            {EMPLOYMENT_TYPES.map((type) => (
              <label key={type.value} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={type.value}
                  {...register("employmentTypes")}
                  className="accent-primary size-4"
                />
                <span>{type.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card space-y-6 rounded-xl border p-6 shadow-sm">
        <h2 className="text-xl font-bold">Expertise</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium">Skills</label>
          <div className="border-input grid h-48 grid-cols-2 gap-2 overflow-y-auto rounded-lg border bg-transparent p-4 sm:grid-cols-3 lg:grid-cols-4">
            {skills.map((skill) => (
              <label
                key={skill.id}
                className="hover:text-primary flex cursor-pointer items-center gap-2 text-sm transition-colors"
              >
                <input
                  type="checkbox"
                  value={skill.id}
                  {...register("skills")}
                  className="accent-primary size-4"
                />
                <span className="truncate">{skill.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <label className="text-sm font-medium">Languages</label>
          <div className="border-input grid h-32 grid-cols-2 gap-2 overflow-y-auto rounded-lg border bg-transparent p-4 sm:grid-cols-3 lg:grid-cols-4">
            {languages.map((lang) => (
              <label
                key={lang.id}
                className="hover:text-primary flex cursor-pointer items-center gap-2 text-sm transition-colors"
              >
                <input
                  type="checkbox"
                  value={lang.id}
                  {...register("languages")}
                  className="accent-primary size-4"
                />
                <span className="truncate">{lang.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pb-10">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
};

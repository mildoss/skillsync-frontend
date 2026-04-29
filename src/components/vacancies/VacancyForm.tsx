"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VacancyData, VacancyFormValues, VacancyInput, vacancySchema } from "@/lib/validation/vacancy";
import { createVacancyAction, updateVacancyAction, deleteVacancyAction } from "@/actions/vacancy";
import { Dictionaries } from "@/types/dictionaries";
import { Vacancy } from "@/types/vacancies";
import { EXPERIENCE_OPTIONS, LOCATION_OPTIONS, WORK_FORMATS, } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/confirm-modal";

type VacancyFormProps = {
  initialData?: Vacancy;
  categories: Dictionaries[];
  skills: Dictionaries[];
  languages: Dictionaries[];
  domains: Dictionaries[];
};

export const VacancyForm = ({
  initialData,
  categories,
  skills,
  languages,
  domains,
  }: VacancyFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VacancyFormValues, unknown, VacancyData>({
    resolver: zodResolver(vacancySchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      categoryId: initialData?.category?.id ?? "",
      domainId: initialData?.domain ?? "",
      type: (initialData?.type as "REMOTE" | "OFFICE" | "HYBRID") ?? "OFFICE",
      experience: initialData?.experience ?? "",
      location: initialData?.location ?? "",
      salaryMin: initialData?.salaryMin ?? "",
      salaryMax: initialData?.salaryMax ?? "",
      skills: initialData?.skills.map((s) => s.id) || [],
      languages: initialData?.languages.map((l) => l.id) || [],
      isActive: initialData?.isActive ?? true,
    },
  });

  const onSubmit = (data: VacancyInput) => {
    startTransition(async () => {
      const res = isEditing
        ? await updateVacancyAction(initialData.id, data)
        : await createVacancyAction(data);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(isEditing ? "Vacancy updated!" : "Vacancy created!");
        router.push("/my-vacancies");
        router.refresh();
      }
    });
  };

  const handleDelete = () => {
    if (!initialData) return;
    startDeleting(async () => {
      const res = await deleteVacancyAction(initialData.id);
      if (res.error) {
        toast.error(res.error);
        setIsDeleteModalOpen(false);
      } else {
        toast.success("Vacancy deleted");
        router.push("/my-vacancies");
        router.refresh();
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-card space-y-4 rounded-xl border p-6 shadow-sm">
          <h2 className="text-xl font-bold">Visibility settings</h2>
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              {...register("isActive")}
              className="accent-primary size-5"
            />
            <div>
              <p className="font-medium">Active and visible</p>
              <p className="text-muted-foreground text-xs">
                When disabled, candidates won&#39;t see this vacancy in search results.
              </p>
            </div>
          </label>
        </div>

        <div className="bg-card space-y-6 rounded-xl border p-6 shadow-sm">
          <h2 className="text-xl font-bold">Basic Information</h2>
          <div className="space-y-1">
            <label className="text-sm font-medium">Job Title *</label>
            <Input placeholder="e.g. Senior Frontend Developer" {...register("title")} className="h-11" />
            {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Category *</label>
              <select {...register("categoryId")} className="border-input flex h-11 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select category...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.categoryId && <p className="text-destructive text-xs">{errors.categoryId.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Domain (Optional)</label>
              <select {...register("domainId")} className="border-input flex h-11 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select domain...</option>
                {domains.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-card space-y-4 rounded-xl border p-6 shadow-sm">
          <h2 className="text-xl font-bold">Description *</h2>
          <textarea
            {...register("description")}
            className="border-input focus-visible:ring-ring flex min-h-64 w-full rounded-lg border bg-transparent px-4 py-3 text-sm outline-none focus-visible:ring-2"
            placeholder="Responsibilities, requirements, benefits..."
          />
          {errors.description && <p className="text-destructive text-xs">{errors.description.message}</p>}
        </div>

        <div className="bg-card space-y-6 rounded-xl border p-6 shadow-sm">
          <h2 className="text-xl font-bold">Job Details</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Work Format *</label>
              <select {...register("type")} className="border-input flex h-11 w-full rounded-lg border bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-primary">
                {WORK_FORMATS.map((w) => <option key={w.value} value={w.value}>{w.label}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Experience (Years)</label>
              <select {...register("experience")} className="border-input flex h-11 w-full rounded-lg border bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-primary">
                <option value="">Any experience</option>
                {EXPERIENCE_OPTIONS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Location</label>
              <select {...register("location")} className="border-input flex h-11 w-full rounded-lg border bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-primary">
                <option value="">Not specified</option>
                {LOCATION_OPTIONS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <label className="text-sm font-medium">Min Salary</label>
                <Input type="number" {...register("salaryMin")} className="h-11" />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-sm font-medium">Max Salary</label>
                <Input type="number" {...register("salaryMax")} className="h-11" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card space-y-6 rounded-xl border p-6 shadow-sm">
          <div className="space-y-2">
            <label className="text-xl font-bold">Skills *</label>
            <div className="border-input grid h-48 grid-cols-2 gap-2 overflow-y-auto rounded-lg border bg-transparent p-4 sm:grid-cols-3 lg:grid-cols-4">
              {skills.map((skill) => (
                <label key={skill.id} className="hover:text-primary flex cursor-pointer items-center gap-2 text-sm transition-colors">
                  <input type="checkbox" value={skill.id} {...register("skills")} className="accent-primary size-4" />
                  <span className="truncate">{skill.name}</span>
                </label>
              ))}
            </div>
            {errors.skills && <p className="text-destructive text-xs">{errors.skills.message}</p>}
          </div>
        </div>

        <div className="bg-card space-y-6 rounded-xl border p-6 shadow-sm">
          <div className="space-y-2">
            <label className="text-xl font-bold">Languages</label>
            <div className="border-input grid h-48 grid-cols-2 gap-2 overflow-y-auto rounded-lg border bg-transparent p-4 sm:grid-cols-3 lg:grid-cols-4">
              {languages.map((lang) => (
                <label key={lang.id} className="hover:text-primary flex cursor-pointer items-center gap-2 text-sm transition-colors">
                  <input type="checkbox" value={lang.id} {...register("languages")} className="accent-primary size-4" />
                  <span className="truncate">{lang.name}</span>
                </label>
              ))}
            </div>
            {errors.languages && <p className="text-destructive text-xs">{errors.languages.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-4 pb-10">
          <Button type="button" size="lg" variant="outline" onClick={() => router.back()} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Vacancy"}
          </Button>
        </div>
      </form>

      {isEditing && (
        <div className="border-destructive/20 bg-destructive/5 mt-12 mb-10 rounded-xl border p-6">
          <h3 className="text-destructive text-lg font-bold">Danger Zone</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Once you delete this vacancy, all application data will be permanently removed.
          </p>
          <Button
            type="button"
            variant="destructive"
            className="mt-4"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete Vacancy
          </Button>
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Vacancy"
        description={`Are you sure you want to delete "${initialData?.title}"?`}
        onCancelAction={() => setIsDeleteModalOpen(false)}
        onConfirmAction={handleDelete}
        isPending={isDeleting}
      />
    </>
  );
};
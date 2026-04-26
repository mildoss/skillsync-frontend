"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { CreateCompanyInput, createCompanySchema } from "@/lib/validation/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCompanyAction } from "@/actions/company";
import { COMPANY_TYPES } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const CreateCompanyForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCompanyInput>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
      description: "",
      logoUrl: "",
      websiteUrl: "",
      companyType: "PRODUCT",
    },
  });

  const onSubmit = (data: CreateCompanyInput) => {
    startTransition(async () => {
      const result = await createCompanyAction(data);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Company created successfully!");
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium">Company Name *</label>
        <Input placeholder="e.g. Google, EPAM" {...register("name")} className="h-11" />
        {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Description</label>
        <textarea
          {...register("description")}
          placeholder="Tell us about your company..."
          className="border-input bg-background focus-visible:ring-ring flex min-h-25 w-full rounded-lg border px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-offset-0"
        />
        {errors.description && (
          <p className="text-destructive text-xs">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium">Company Type *</label>
          <select
            {...register("companyType")}
            className="border-input bg-background focus-visible:ring-ring flex h-11 w-full rounded-lg border px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {COMPANY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.companyType && (
            <p className="text-destructive text-xs">{errors.companyType.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Website URL</label>
          <Input placeholder="https://..." {...register("websiteUrl")} className="h-11" />
          {errors.websiteUrl && (
            <p className="text-destructive text-xs">{errors.websiteUrl.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Logo URL</label>
          <Input placeholder="https://.../logo.png" {...register("logoUrl")} className="h-11" />
          {errors.logoUrl && <p className="text-destructive text-xs">{errors.logoUrl.message}</p>}
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full text-base" disabled={isPending}>
        {isPending ? "Creating..." : "Create Company"}
      </Button>
    </form>
  );
};
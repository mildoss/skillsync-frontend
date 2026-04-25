"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCompanyInput, createCompanySchema } from "@/lib/validation/company";
import { updateCompanyAction } from "@/actions/company";
import { COMPANY_TYPES } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CompanyDetail } from "@/types/companies";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { Info } from "lucide-react";

export const UpdateCompanyForm = ({
  company,
  isReadOnly,
}: {
  company: CompanyDetail;
  isReadOnly: boolean;
}) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateCompanyInput>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: company.name || "",
      description: company.description || "",
      logoUrl: company.logoUrl || "",
      websiteUrl: company.websiteUrl || "",
      companyType: company.companyType,
    },
  });

  const logoUrl = watch("logoUrl");
  const name = watch("name");

  const onSubmit = (data: CreateCompanyInput) => {
    if (isReadOnly) return;
    setServerError(null);
    setIsSuccess(false);

    startTransition(async () => {
      const result = await updateCompanyAction(company.id, data);
      if (result?.error) {
        setServerError(result.error);
      } else {
        setIsSuccess(true);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {isReadOnly && (
        <div className="bg-muted/50 text-muted-foreground flex items-center gap-3 rounded-lg border p-4 text-sm font-medium">
          <Info className="size-4 shrink-0" />
          You are viewing this company as a Recruiter. Only the Owner can edit these details.
        </div>
      )}

      <div className="flex items-center gap-6 border-b pb-6">
        <CustomAvatar imageUrl={logoUrl} fallbackText={name || "?"} size="lg" />
        <div>
          <h3 className="text-xl font-bold">{name || "Company Name"}</h3>
          <p className="text-muted-foreground text-sm">Preview of your brand identity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium">Company Name *</label>
          <Input {...register("name")} disabled={isReadOnly} className="h-11" />
          {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Company Type *</label>
          <select
            {...register("companyType")}
            disabled={isReadOnly}
            className="border-input bg-transparent focus-visible:ring-ring flex h-11 w-full rounded-lg border px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-3 disabled:opacity-70"
          >
            {COMPANY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Website URL</label>
          <Input
            {...register("websiteUrl")}
            disabled={isReadOnly}
            className="h-11"
            placeholder="https://..."
          />
          {errors.websiteUrl && (
            <p className="text-destructive text-xs">{errors.websiteUrl.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Logo URL</label>
          <Input
            {...register("logoUrl")}
            disabled={isReadOnly}
            className="h-11"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Description</label>
        <textarea
          {...register("description")}
          disabled={isReadOnly}
          placeholder="Tell us about your company..."
          className="border-input bg-transparent focus-visible:ring-ring flex min-h-32 w-full rounded-lg border px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-3 disabled:opacity-70"
        />
      </div>

      {!isReadOnly && (
        <div className="flex flex-col gap-4 border-t pt-6">
          {serverError && <p className="text-destructive text-sm font-medium">{serverError}</p>}
          {isSuccess && (
            <p className="text-success text-sm font-medium">Company details updated!</p>
          )}
          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

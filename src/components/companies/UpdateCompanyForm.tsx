"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCompanyInput, createCompanySchema } from "@/lib/validation/company";
import { deleteCompanyAction, leaveCompanyAction, updateCompanyAction } from "@/actions/company";
import { COMPANY_TYPES } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CompanyDetail } from "@/types/companies";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {ConfirmModal} from "@/components/ui/confirm-modal";

export const UpdateCompanyForm = ({
  company,
  isReadOnly,
  }: {
  company: CompanyDetail;
  isReadOnly: boolean;
}) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, startDeleting] = useTransition();
  const [isLeaving, startLeaving] = useTransition();

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

  const onSubmit = async (data: CreateCompanyInput) => {
    if (isReadOnly) return;

    setIsPending(true);
    const result = await updateCompanyAction(company.id, data);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Company details updated!");
    }
    setIsPending(false);
  };

  const handleDeleteCompany = () => {
    startDeleting(async () => {
      const res = await deleteCompanyAction(company.id);
      if (res.error) {
        toast.error(res.error);
        setIsDeleteModalOpen(false);
      } else {
        toast.success("Company deleted permanently");
        router.push("/company");
        router.refresh();
      }
    });
  };

  const handleLeave = () => {
    startLeaving(async () => {
      const res = await leaveCompanyAction();
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("You have left the company");
        router.refresh();
      }
      setIsLeaveModalOpen(false);
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {isReadOnly && (
          <div className="bg-muted/50 text-muted-foreground flex items-center justify-between gap-3 rounded-lg border mt-4 p-4 text-sm font-medium">
            <div className="flex items-center gap-3">
              <Info className="size-4 shrink-0" />
              <span>
              You are viewing this company as a Recruiter. Only the Owner can edit these details.
            </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10 border-destructive/20 cursor-pointer"
              onClick={() => setIsLeaveModalOpen(true)}
            >
              Leave Company
            </Button>
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
              className="border-input focus-visible:ring-ring flex h-11 w-full rounded-lg border bg-transparent px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-3 disabled:opacity-70"
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
            className="border-input focus-visible:ring-ring flex min-h-32 w-full rounded-lg border bg-transparent px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-3 disabled:opacity-70"
          />
        </div>

        {!isReadOnly && (
          <div className="flex flex-col gap-4 border-t pt-6">
            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </form>

      {!isReadOnly && (
        <div className="border-destructive/20 bg-destructive/5 mt-12 rounded-xl border p-6">
          <h3 className="text-destructive text-lg font-bold">Danger Zone</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Once you delete your company, there is no going back. All vacancies and team connections
            will be permanently removed.
          </p>
          <Button
            type="button"
            variant="destructive"
            className="mt-4"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete Company
          </Button>
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Company"
        description={`Are you absolutely sure you want to delete ${company.name}? This action cannot be undone.`}
        onCancelAction={() => setIsDeleteModalOpen(false)}
        onConfirmAction={handleDeleteCompany}
        isPending={isDeleting}
      />

      <ConfirmModal
        isOpen={isLeaveModalOpen}
        title="Leave Company"
        description={`Are you sure you want to leave ${company.name}? You will lose access to all team features.`}
        onCancelAction={() => setIsLeaveModalOpen(false)}
        onConfirmAction={handleLeave}
        isPending={isLeaving}
      />
    </>
  );
};

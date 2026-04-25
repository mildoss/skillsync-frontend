"use client";

import { User } from "@/types/users";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { UpdateEmployerProfileInput, updateEmployerProfileSchema } from "@/lib/validation/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserAction } from "@/actions/user";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const EmployerProfileForm = ({ user }: { user: User }) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdateEmployerProfileInput>({
    resolver: zodResolver(updateEmployerProfileSchema),
    defaultValues: {
      name: user.name || "",
      position: user.position || "",
      about: user.about || "",
      avatarUrl: user.avatarUrl || "",
    },
  });

  const avatarUrl = watch("avatarUrl");
  const name = watch("name");
  const position = watch("position");

  const onSubmit = (data: UpdateEmployerProfileInput) => {
    setServerError(null);
    setIsSuccess(false);

    startTransition(async () => {
      const res = await updateUserAction(data);
      if (res.error) {
        setServerError(res.error);
      } else {
        setIsSuccess(true);
        router.refresh();
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-card space-y-8 rounded-xl border p-6 sm:p-8"
    >
      <div className="flex items-center gap-6 border-b pb-6">
        <CustomAvatar imageUrl={avatarUrl} fallbackText={name || "?"} size="lg" />
        <div>
          <h3 className="text-xl font-bold">{name || "Your Name"}</h3>
          <p className="text-muted-foreground font-medium">{position || "Your Position"}</p>
        </div>
      </div>

      {serverError && (
        <div className="bg-destructive/15 text-destructive rounded-lg p-3 text-sm font-medium">
          {serverError}
        </div>
      )}

      {isSuccess && (
        <div className="bg-success/15 text-success rounded-lg p-3 text-sm font-medium">
          Profile updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium">Full Name *</label>
          <Input placeholder="John Doe" {...register("name")} className="h-11" />
          {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Job Title (Position)</label>
          <Input
            placeholder="e.g. HR Manager, Tech Lead"
            {...register("position")}
            className="h-11"
          />
          {errors.position && <p className="text-destructive text-xs">{errors.position.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Avatar URL</label>
        <Input placeholder="https://..." {...register("avatarUrl")} className="h-11" />
        {errors.avatarUrl && <p className="text-destructive text-xs">{errors.avatarUrl.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">About Me</label>
        <textarea
          {...register("about")}
          placeholder="Tell candidates a little bit about yourself..."
          className="border-input bg-transparent focus-visible:ring-ring flex min-h-24 w-full rounded-lg border px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-offset-0"
        />
        {errors.about && <p className="text-destructive text-xs">{errors.about.message}</p>}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
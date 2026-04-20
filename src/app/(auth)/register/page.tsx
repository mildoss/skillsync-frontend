"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validation/auth";
import { registerAction } from "@/actions/auth";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "APPLICANT",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = (data: RegisterInput) => {
    setServerError(null);

    startTransition(async () => {
      const result = await registerAction(data);

      if (result?.error) {
        setServerError(result.error);
      }
    });
  };

  return (
    <AuthWrapper
      title="Create an account"
      subtitle="Join SkillSync to find your next opportunity"
      footerText="Already have an account? "
      footerLink="/login"
      footerLinkText="Log in"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div
            onClick={() => setValue("role", "APPLICANT")}
            className={cn(
              "cursor-pointer rounded-xl border p-4 text-center transition-all",
              selectedRole === "APPLICANT"
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "hover:bg-muted hover:border-border"
            )}
          >
            <UserRound className={cn("mx-auto mb-2 size-6", selectedRole === "APPLICANT" ? "text-primary" : "text-muted-foreground")} />
            <p className="text-sm font-semibold">I&apos;m looking for work</p>
          </div>

          <div
            onClick={() => setValue("role", "EMPLOYER")}
            className={cn(
              "cursor-pointer rounded-xl border p-4 text-center transition-all",
              selectedRole === "EMPLOYER"
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "hover:bg-muted hover:border-border"
            )}
          >
            <Briefcase className={cn("mx-auto mb-2 size-6", selectedRole === "EMPLOYER" ? "text-primary" : "text-muted-foreground")} />
            <p className="text-sm font-semibold">I&apos;m hiring</p>
          </div>
        </div>

        {serverError && (
          <div className="bg-destructive/15 text-destructive rounded-lg p-3 text-sm font-medium">
            {serverError}
          </div>
        )}

        <div className="space-y-1">
          <Input placeholder="Username" {...register("username")} className="h-11" />
          {errors.username && <p className="text-destructive text-xs">{errors.username.message}</p>}
        </div>

        <div className="space-y-1">
          <Input placeholder="Email" type="email" {...register("email")} className="h-11" />
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <Input placeholder="Password" type="password" {...register("password")} className="h-11" />
          {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
        </div>

        <div className="space-y-1">
          <Input placeholder="Confirm Password" type="password" {...register("confirmPassword")} className="h-11" />
          {errors.confirmPassword && <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" size="lg" className="w-full text-base" disabled={isPending}>
          {isPending ? "Creating account..." : "Sign up"}
        </Button>
      </form>
    </AuthWrapper>
  );
}
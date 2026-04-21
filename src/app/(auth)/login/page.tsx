"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, loginSchema } from "@/lib/validation/auth";
import { loginAction } from "@/actions/auth";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    setServerError(null);

    startTransition(async () => {
      const result = await loginAction(data);

      if (result?.error) {
        setServerError(result.error);
      }
    });
  };

  return (
    <AuthWrapper
      title="Welcome back"
      subtitle="Join SkillSync to find your next opportunity"
      footerText="Don't have an account? "
      footerLink="/register"
      footerLinkText="Sign up"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {serverError && (
          <div className="bg-destructive/15 text-destructive rounded-lg p-3 text-sm font-medium">
            {serverError}
          </div>
        )}

        <div className="space-y-1">
          <Input placeholder="Email" type="email" {...register("email")} className="h-11" />
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <Input placeholder="Password" type="password" {...register("password")} className="h-11" />
          {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
        </div>

        <Button type="submit" size="lg" className="w-full text-base" disabled={isPending}>
          {isPending ? "Logging in..." : "Log in"}
        </Button>
      </form>
    </AuthWrapper>
  );
}
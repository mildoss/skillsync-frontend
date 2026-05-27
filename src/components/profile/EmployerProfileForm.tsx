"use client";

import { User } from "@/types/users";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { UpdateEmployerProfileInput, updateEmployerProfileSchema } from "@/lib/validation/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserAction, uploadMediaAction } from "@/actions/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ImageUpload } from "@/components/shared/ImageUpload";
import * as z from "zod";

export const EmployerProfileForm = ({ user }: { user: User }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hasAvatarChanged, setHasAvatarChanged] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.input<typeof updateEmployerProfileSchema>, unknown, UpdateEmployerProfileInput>({
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
  const surname = watch("surname");
  const position = watch("position");

  const onSubmit = (data: UpdateEmployerProfileInput) => {
    startTransition(async () => {
      let finalAvatarUrl = data.avatarUrl;

      if (hasAvatarChanged) {
        if (selectedFile) {
          const mediaFormData = new FormData();
          mediaFormData.append("file", selectedFile);

          const mediaRes = await uploadMediaAction(mediaFormData);

          if (mediaRes.error) {
            const errorMsg =
              mediaRes.error === "File too large"
                ? "The file exceeds the allowed size of 5 MB."
                : mediaRes.error;

            toast.error(errorMsg);
            return;
          }

          finalAvatarUrl = mediaRes.url;
        } else if (avatarUrl === "") {
          finalAvatarUrl = null;
        }
      }

      const res = await updateUserAction({
        ...data,
        avatarUrl: finalAvatarUrl,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Profile updated successfully!");
        setHasAvatarChanged(false);
        router.refresh();
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-card space-y-8 rounded-xl border p-6 sm:p-8"
    >
      <div className="flex flex-col gap-6 border-b pb-6">
        <ImageUpload
          currentImageUrl={avatarUrl}
          name={name}
          onFileSelectAction={(file) => {
            setSelectedFile(file);
            setHasAvatarChanged(true);
          }}
          onRemoveAction={() => {
            setValue("avatarUrl", "");
            setHasAvatarChanged(true);
          }}
        />

        <div>
          <h3 className="text-xl font-bold truncate">{name || "Name"} {surname || "Surname"}</h3>
          <p className="text-muted-foreground font-medium truncate">{position || "Position"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium">Name</label>
          <Input placeholder="John" {...register("name")} className="h-11" />
          {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Surname</label>
          <Input placeholder="Doe" {...register("surname")} className="h-11" />
          {errors.surname && <p className="text-destructive text-xs">{errors.surname.message}</p>}
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
        <label className="text-sm font-medium">About Me</label>
        <textarea
          {...register("about")}
          placeholder="Tell candidates a little bit about yourself..."
          className="border-input focus-visible:ring-ring flex min-h-24 w-full rounded-lg border bg-transparent px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-offset-0"
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
import Image from "next/image";
import { cn } from "@/lib/utils";

type CustomAvatarProps = {
  imageUrl?: string | null;
  fallbackText: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export const CustomAvatar = ({ imageUrl, fallbackText, size = "sm", className }: CustomAvatarProps) => {
  const sizeClasses = {
    sm: "size-10 sm:size-12 text-lg",
    md: "size-16 text-2xl",
    lg: "size-20 sm:size-24 text-3xl sm:text-4xl",
  };

  const dimensions = {
    sm: 48,
    md: 64,
    lg: 96,
  };

  const currentSizeClass = sizeClasses[size];
  const dimension = dimensions[size];

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={fallbackText}
        width={dimension}
        height={dimension}
        className={cn("shrink-0 rounded-xl object-cover shadow-sm", currentSizeClass, className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "bg-muted-foreground flex shrink-0 items-center justify-center rounded-xl font-bold text-white shadow-sm",
        currentSizeClass,
        className
      )}
    >
      {fallbackText ? fallbackText[0].toUpperCase() : "?"}
    </div>
  );
};
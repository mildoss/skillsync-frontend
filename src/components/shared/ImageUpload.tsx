"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { ImagePlus, X } from "lucide-react";

type ImageUploadProps = {
  currentImageUrl?: string | null;
  name?: string;
  onFileSelectAction: (file: File | null) => void;
  onRemoveAction: () => void;
};

export const ImageUpload = ({
  currentImageUrl,
  name,
  onFileSelectAction,
  onRemoveAction,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreview(currentImageUrl || null);
  }, [currentImageUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelectAction(file);

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onFileSelectAction(null);
    onRemoveAction();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <CustomAvatar imageUrl={preview || ""} fallbackText={name || "?"} size="lg" />

      <div className="flex flex-col gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
        />

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            {preview ? "Change Avatar" : "Upload Avatar"}
          </Button>

          {preview && (
            <Button type="button" variant="destructive" size="sm" onClick={handleRemove}>
              <X className="mr-2 h-4 w-4" />
              Remove
            </Button>
          )}
        </div>
        <p className="text-muted-foreground text-xs">JPG, PNG or WEBP. Max size 5MB.</p>
      </div>
    </div>
  );
};

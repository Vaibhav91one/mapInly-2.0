"use client";

import { useCallback, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ImageUpload({
  value,
  onChange,
  error,
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;
      try {
        const dataUrl = await fileToDataUrl(file);
        onChange(dataUrl);
      } catch {
        // ignore read errors
      }
      e.target.value = "";
    },
    [onChange]
  );

  const handleClick = () => inputRef.current?.click();

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        aria-invalid={!!error}
      />
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        className={cn(
          "w-full justify-start gap-2 rounded-none border-white/20 bg-black text-white hover:bg-white/10 focus-visible:ring-0 focus-visible:ring-offset-0",
          error && "border-destructive"
        )}
      >
        <Upload className="size-4" />
        {value ? "Change image" : "Upload image"}
      </Button>
      {value && (
        <p className="text-xs text-white/70 truncate" title={value}>
          Image selected
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

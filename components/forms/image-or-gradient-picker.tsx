"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Upload, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientThumbnail } from "./gradient-thumbnail";
import { cn } from "@/lib/utils";

const DEFAULT_PRESETS: string[][] = [
  ["#b8cd65", "#6200ff", "#e2a3ff", "#ff99fd"],
  ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"],
  ["#667eea", "#764ba2", "#f093fb", "#f5576c"],
  ["#11998e", "#38ef7d", "#ee9ca7", "#ffecd2"],
];

function randomHex(): string {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
}

function randomPreset(): string[] {
  return [randomHex(), randomHex(), randomHex(), randomHex()];
}

function gradientToValue(colors: string[]): string {
  return `gradient:${colors.join(",")}`;
}

function parseGradient(value: string): string[] | null {
  if (!value?.startsWith("gradient:")) return null;
  const colors = value.slice(9).split(",").map((c) => c.trim());
  return colors.length === 4 ? colors : null;
}

interface ImageOrGradientPickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  inputClassName?: string;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ImageOrGradientPicker({
  value,
  onChange,
  error,
  className,
  inputClassName,
}: ImageOrGradientPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [presets, setPresets] = useState<string[][]>(DEFAULT_PRESETS);
  const [fileName, setFileName] = useState<string | null>(null);

  const isGradient = value?.startsWith("gradient:");
  const selectedGradientColors = useMemo(
    () => (isGradient ? parseGradient(value) : null),
    [value, isGradient]
  );

  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !ALLOWED_IMAGE_TYPES.includes(file.type)) return;
      try {
        const dataUrl = await fileToDataUrl(file);
        setFileName(file.name);
        onChange(dataUrl);
      } catch {
        // ignore
      }
      e.target.value = "";
    },
    [onChange]
  );

  const handleUploadClick = () => inputRef.current?.click();

  const handleGradientSelect = useCallback(
    (colors: string[]) => {
      setFileName(null);
      onChange(gradientToValue(colors));
    },
    [onChange]
  );

  const handleRandomize = useCallback(() => {
    setFileName(null);
    const newPresets = [
      randomPreset(),
      randomPreset(),
      randomPreset(),
      randomPreset(),
    ];
    setPresets(newPresets);
    onChange(gradientToValue(newPresets[0]));
  }, [onChange]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          aria-invalid={!!error}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleUploadClick}
          className={cn(
            "w-full justify-start gap-2 rounded-none border-white/20 bg-black text-white hover:bg-white/10 focus-visible:ring-0 focus-visible:ring-offset-0",
            error && "border-destructive",
            inputClassName
          )}
        >
          <Upload className="size-4" />
          {value && !isGradient ? "Change image" : "Upload image"}
        </Button>
        {value && (
          <div className="space-y-2">
            <div className="h-40 w-full overflow-hidden rounded-md border border-white/20">
              {isGradient && selectedGradientColors ? (
                <GradientThumbnail
                  colors={selectedGradientColors}
                  selected={false}
                  className="h-full w-full border-0"
                />
              ) : (
                <img
                  src={value}
                  alt="Preview"
                  className="h-full w-full object-contain"
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isGradient ? "Gradient selected" : `Selected: ${fileName ?? "Image"}`}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm text-white/80">Or choose a gradient</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRandomize}
          className="rounded-none border-white/20 bg-black text-white hover:bg-white/10 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Shuffle className="size-4" />
          Randomize colors
        </Button>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((colors, i) => {
            const gradientValue = gradientToValue(colors);
            const isSelected =
              isGradient &&
              selectedGradientColors &&
              colors.every((c, j) => c === selectedGradientColors[j]);
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleGradientSelect(colors)}
                className="cursor-pointer rounded-md transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-pressed={isSelected || undefined}
              >
                <GradientThumbnail colors={colors} selected={isSelected ?? false} />
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

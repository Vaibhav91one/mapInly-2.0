"use client";

import { useState, useCallback, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  label?: string;
  error?: string;
  className?: string;
  buttonClassName?: string;
  inputClassName?: string;
}

function toTimeString(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function parseTimeString(timeStr: string): { hours: number; minutes: number } {
  const [h, m] = timeStr.split(":").map(Number);
  return { hours: h || 0, minutes: m || 0 };
}

export function DateTimePicker({
  value,
  onChange,
  label = "Date & time",
  error,
  className,
  buttonClassName,
  inputClassName,
}: DateTimePickerProps) {
  const [timeStr, setTimeStr] = useState(() =>
    value ? toTimeString(value) : "09:00"
  );

  useEffect(() => {
    if (value) setTimeStr(toTimeString(value));
  }, [value]);

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date) return;
      const base = value ?? new Date();
      const { hours, minutes } = parseTimeString(timeStr);
      const combined = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes,
        0,
        0
      );
      onChange(combined);
    },
    [value, timeStr, onChange]
  );

  const handleTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setTimeStr(next);
      const base = value ?? new Date();
      const { hours, minutes } = parseTimeString(next);
      const combined = new Date(
        base.getFullYear(),
        base.getMonth(),
        base.getDate(),
        hours,
        minutes,
        0,
        0
      );
      onChange(combined);
    },
    [value, onChange]
  );

  const displayDate = value ? format(value, "PPP") : "Pick a date";
  const effectiveValue = value ?? new Date();

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label
          htmlFor="date-time-picker"
          className={cn("text-white", error && "text-destructive")}
        >
          {label}
        </Label>
      )}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal rounded-none bg-black border-white/20 text-white hover:bg-white/10 focus-visible:ring-0 focus-visible:ring-offset-0",
                !value && "text-muted-foreground",
                error && "border-destructive",
                buttonClassName
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {displayDate}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 bg-secondary border-white/20 text-white"
            align="start"
          >
            <Calendar
              mode="single"
              selected={effectiveValue}
              onSelect={handleDateSelect}
              initialFocus
              classNames={{
                today:
                  value && !isSameDay(value, new Date())
                    ? "bg-transparent"
                    : undefined,
                weekday: "text-white/70",
                week_number: "text-white/70",
                outside: "text-white/50",
                disabled: "text-white/40",
              }}
            />
          </PopoverContent>
        </Popover>
        <Input
          id="date-time-picker"
          type="time"
          value={timeStr}
          onChange={handleTimeChange}
          step="900"
          className={cn(
            "rounded-none border-white/20 bg-black text-white [color-scheme:dark] focus-visible:ring-0 focus-visible:ring-offset-0",
            error && "border-destructive",
            inputClassName
          )}
          aria-invalid={!!error}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

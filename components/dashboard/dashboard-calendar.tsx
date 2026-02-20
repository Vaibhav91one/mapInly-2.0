"use client";

import { useState } from "react";
import { isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DashboardCalendarProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  datesWithEvents?: Date[];
  className?: string;
}

export function DashboardCalendar({
  date,
  onDateChange,
  datesWithEvents = [],
  className,
}: DashboardCalendarProps) {
  const [internalDate, setInternalDate] = useState<Date | undefined>(
    date ?? new Date()
  );

  const displayedDate = date ?? internalDate;
  const handleDateChange = onDateChange ?? setInternalDate;

  const hasEvent = (day: Date) =>
    datesWithEvents.some((d) => isSameDay(d, day));

  return (
    <div className={cn("w-full space-y-2", className)}>
      <Calendar
        mode="single"
        selected={displayedDate}
        onSelect={handleDateChange}
        fixedWeeks
        className="!bg-transparent w-full [--cell-size:2.75rem]"
        classNames={{
          root: "!w-full",
          month: "!w-full gap-6",
          table: "mt-4",
          weekdays: "!w-full [&_[data-slot]]:font-normal [&_[data-slot]]:tracking-tight [&_[data-slot]]:leading-tight",
          week: "!w-full mt-3 first:mt-2",
          day: "[&_button]:!gap-2",
          weekday:
            "!text-white/70 !font-regular !tracking-tight !leading-tight",
          outside: "!text-white/40 aria-selected:!text-white/40",
          disabled: "!text-white/30",
          caption_label: "!text-white",
          button_previous:
            "!text-white hover:!bg-white/20 !p-2 min-w-[2.75rem] min-h-[2.75rem]",
          button_next:
            "!text-white hover:!bg-white/20 !p-2 min-w-[2.75rem] min-h-[2.75rem]",
        }}
        modifiers={{
          hasEvent: (day) => hasEvent(day),
        }}
        modifiersClassNames={{
          hasEvent:
            "relative after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:size-2 after:rounded-full after:bg-primary",
        }}
      />
    </div>
  );
}

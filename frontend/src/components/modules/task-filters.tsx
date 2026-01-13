"use client";

import * as React from "react";
import { ListFilter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type TaskStatus = "all" | "pending" | "completed";

interface TaskFiltersProps {
  currentStatus: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
}

export function TaskFilters({ currentStatus, onStatusChange }: TaskFiltersProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const options: { label: string; value: TaskStatus }[] = [
    { label: "All Tasks", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-surface px-3 py-2 text-sm font-medium transition-all hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
      >
        <ListFilter className="h-4 w-4" />
        <span className="hidden sm:inline">Status: </span>
        <span className="capitalize">{currentStatus}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 z-20 w-44 origin-top-left rounded-lg border border-gray-200 bg-surface py-1 shadow-lg dark:border-gray-800 animate-in fade-in zoom-in-95">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onStatusChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-gray-800",
                  currentStatus === option.value && "bg-primary/5 text-primary font-semibold"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

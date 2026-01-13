import * as React from "react";
import { ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  className?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-surface px-6 py-12 text-center dark:border-gray-800",
        className
      )}
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-400 dark:bg-gray-800">
        {icon || <ClipboardList className="h-10 w-10" />}
      </div>
      <h3 className="text-xl font-bold tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

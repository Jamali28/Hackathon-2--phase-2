"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task } from "./task-card";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"]),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: TaskFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TaskForm({ initialData, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      priority: initialData?.priority || "Medium",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Task Title"
        placeholder="What needs to be done?"
        error={errors.title?.message}
        {...register("title")}
        autoFocus
      />
      <div className="space-y-1.5 px-1">
        <label className="text-sm font-medium text-foreground">
          Description (Optional)
        </label>
        <textarea
          className="flex min-h-[100px] w-full rounded-lg border border-gray-200 bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700"
          placeholder="Add some details..."
          {...register("description")}
        />
      </div>
      <div className="space-y-1.5 px-1">
        <label className="text-sm font-medium text-foreground">
          Priority
        </label>
        <div className="flex gap-2">
          {["Low", "Medium", "High"].map((p) => (
            <label
              key={p}
              className={cn(
                "flex-1 cursor-pointer rounded-lg border p-2 text-center text-xs font-semibold transition-all",
                "hover:bg-gray-50 dark:hover:bg-gray-800",
                "has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:text-primary dark:border-gray-700"
              )}
            >
              <input
                type="radio"
                className="sr-only"
                value={p}
                {...register("priority")}
              />
              {p}
            </label>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

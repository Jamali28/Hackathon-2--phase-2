"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, MoreVertical, Trash2, Edit2, Clock } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
  createdAt: string;
}

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const priorityVariants = {
    Low: "info",
    Medium: "warning",
    High: "error",
  } as const;

  return (
    <Card className={cn(
      "group relative flex flex-col transition-all duration-300",
      task.completed && "opacity-60"
    )}>
      <CardHeader className="flex flex-row items-start justify-between p-4 pb-2 space-y-0">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            onClick={() => onToggle(task.id)}
            className={cn(
              "mt-1 shrink-0 rounded-full transition-colors",
              task.completed ? "text-success" : "text-gray-400 hover:text-primary"
            )}
          >
            {task.completed ? (
              <CheckCircle2 className="h-5 w-5 fill-success/10" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "text-base font-semibold leading-tight truncate",
              task.completed && "line-through text-gray-500"
            )}>
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                {task.description}
              </p>
            )}
          </div>
        </div>
        <div className="relative ml-2 shrink-0">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
              <div className="absolute right-0 mt-1 z-20 w-32 origin-top-right rounded-lg border border-gray-200 bg-surface py-1 shadow-lg dark:border-gray-800 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => { onEdit(task); setIsMenuOpen(false); }}
                  className="flex w-full items-center px-3 py-2 text-xs text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Edit2 className="mr-2 h-3 w-3" /> Edit
                </button>
                <button
                  onClick={() => { onDelete(task.id); setIsMenuOpen(false); }}
                  className="flex w-full items-center px-3 py-2 text-xs text-error hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="mr-2 h-3 w-3" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex items-center gap-3 p-4 pt-1">
        <Badge variant={priorityVariants[task.priority]}>{task.priority}</Badge>
        <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-gray-500">
          <Clock className="h-3 w-3" />
          {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}

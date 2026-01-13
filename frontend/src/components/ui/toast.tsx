"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex w-full max-w-sm transform items-center gap-3 rounded-xl border bg-surface p-4 shadow-xl transition-all animate-in slide-in-from-right-full duration-300",
              t.type === "success" && "border-success/30 bg-green-50/50 dark:bg-green-950/20",
              t.type === "error" && "border-error/30 bg-red-50/50 dark:bg-red-950/20",
              t.type === "info" && "border-blue-200 bg-blue-50/50 dark:bg-blue-950/20"
            )}
          >
            {t.type === "success" && <CheckCircle2 className="h-5 w-5 text-success" />}
            {t.type === "error" && <AlertCircle className="h-5 w-5 text-error" />}
            {t.type === "info" && <Info className="h-5 w-5 text-blue-600" />}

            <p className="flex-1 text-sm font-medium text-foreground">{t.message}</p>

            <button
              onClick={() => removeToast(t.id)}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

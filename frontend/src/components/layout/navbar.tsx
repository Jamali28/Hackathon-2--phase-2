"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Moon, Sun, User, LogOut, Settings, CheckSquare } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  // Simulated session - will use useSession() from Better Auth later
  const session = { user: { name: "John Doe", email: "john@example.com" } };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-surface/80 backdrop-blur-md dark:border-gray-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
            <CheckSquare className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Todo SaaS
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 p-0"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {session ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <span className="hidden text-sm font-medium sm:inline-block">
                  {session.user.name}
                </span>
              </Button>

              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 z-20 w-48 origin-top-right rounded-lg border border-gray-200 bg-surface py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-gray-800">
                    <div className="px-4 py-2 text-xs text-gray-500 font-medium border-b border-gray-200 dark:border-gray-800 mb-1">
                      {session.user.email}
                    </div>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        router.push("/profile");
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </button>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-error hover:bg-red-50 dark:hover:bg-red-950/20"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        console.log("Logging out...");
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

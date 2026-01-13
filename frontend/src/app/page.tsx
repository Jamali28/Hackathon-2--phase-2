import Link from "next/link";
import { CheckSquare, Shield, Zap, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/10">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-surface/80 backdrop-blur-md dark:border-gray-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-md">
              <CheckSquare className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Todo SaaS
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),theme(colors.white))] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900/0.2),theme(colors.gray.950))]" />
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:text-gray-400 dark:ring-white/10">
                Phase II is now live.{" "}
                <Link href="/dashboard" className="font-semibold text-primary">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Try the Dashboard <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Organize your tasks with precision.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400 font-medium">
              A premium, secure, and modern todo platform designed for high-performance teams. Built with Next.js, FastAPI, and Neon.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/signup">
                <Button size="lg" className="px-8 flex items-center gap-2 group">
                  Get Started for Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="https://nextjs.org/docs" className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors">
                Read Documentation <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-6 py-24 sm:py-32">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-start gap-4 p-6 rounded-2xl border border-gray-200 bg-surface/50 dark:border-gray-800">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/30">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Secure & Private</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Full multi-user isolation with JWT authentication ensures your data stays private and secure.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 p-6 rounded-2xl border border-gray-200 bg-surface/50 dark:border-gray-800">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 dark:bg-green-900/30">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Incredibly Fast</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Built with the latest App Router and Server Components for instant loading and high performance.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 p-6 rounded-2xl border border-gray-200 bg-surface/50 dark:border-gray-800">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 dark:bg-indigo-900/30">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Modern Design</h3>
              <p className="text-gray-500 dark:text-gray-400">
                A clean, minimal interface with beautiful typography, animations, and full dark mode support.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-surface py-12 dark:border-gray-800">
        <div className="container mx-auto px-6 text-center text-sm text-gray-500">
          <p>© 2026 Todo SaaS. Built by muhee during the Hackathon Phase 2.</p>
        </div>
      </footer>
    </div>
  );
}

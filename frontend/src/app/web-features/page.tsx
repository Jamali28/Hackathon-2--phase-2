import Link from "next/link";
import { CheckSquare, Globe, Smartphone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WebFeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-surface/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Globe className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">Web Features</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Web Features Showcase
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
              Demonstrating responsive, accessible, and fast web experiences.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-start gap-4 p-6 rounded-2xl border bg-surface/50">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 dark:bg-indigo-900/30">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Fast Loading</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Optimized for performance with lazy loading and efficient bundling.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 p-6 rounded-2xl border bg-surface/50">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 dark:bg-green-900/30">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Responsive Design</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Looks great on mobile, tablet, and desktop devices.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 p-6 rounded-2xl border bg-surface/50">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 dark:bg-purple-900/30">
                <CheckSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Accessible</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Built with accessibility standards for all users.
              </p>
            </div>
          </div>
        </section>

        {/* Back to Home */}
        <section className="container mx-auto px-6 py-12 text-center">
          <Link href="/">
            <Button size="lg" className="px-8">
              Back to Homepage
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
}
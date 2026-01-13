"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { signUp } from "@/lib/auth-client";
import { useToast } from "@/components/ui/toast";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch("password", "");
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const { error } = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: "/dashboard",
      });

      if (error) {
        throw new Error(error.message || "Failed to create account");
      }

      toast("Account created successfully", "success");
      router.push("/dashboard");
    } catch (err: any) {
      setServerError(err.message || "An error occurred during registration");
      toast(err.message || "Registration failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="backdrop-blur-md bg-surface/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Create an Account</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <Input
            label="Name"
            type="text"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register("name")}
            disabled={isLoading}
          />
          <Input
            label="Email"
            type="email"
            placeholder="name@example.com"
            error={errors.email?.message}
            {...register("email")}
            disabled={isLoading}
          />
          <div className="space-y-2">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
              disabled={isLoading}
            />
            {password && (
              <div className="flex gap-2 px-1">
                {[hasMinLength, hasLetter, hasNumber].map((check, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 w-full rounded-full transition-colors",
                      check ? "bg-success" : "bg-gray-200 dark:bg-gray-700"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
          {serverError && (
            <p className="text-sm font-medium text-error text-center animate-in fade-in slide-in-from-top-1">
              {serverError}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full h-11" isLoading={isLoading}>
            Create Account
          </Button>
          <div className="text-sm text-center text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

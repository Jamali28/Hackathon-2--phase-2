import { createAuthClient } from "better-auth/client";

// Pointing to the frontend for authentication endpoints
// Better Auth endpoints will be available at /api/auth/*
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;

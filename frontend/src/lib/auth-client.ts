import { createAuthClient } from "better-auth/client";

// Pointing to the current origin for authentication endpoints
// Better Auth endpoints will be available at /api/auth/*
export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL
      ? process.env.NEXT_PUBLIC_APP_URL.startsWith('http')
        ? process.env.NEXT_PUBLIC_APP_URL
        : `https://${process.env.NEXT_PUBLIC_APP_URL}`
      : "http://localhost:3000",
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;

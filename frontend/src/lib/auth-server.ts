import { auth } from './auth';
import { cookies } from 'next/headers';
import { cache } from 'react';

// Server-side session validation function
export async function validateSessionServer() {
  try {
    // Get the session token from cookies
    const cookieStore = await cookies();
    const sessionToken =
      cookieStore.get('better-auth.session_token')?.value ||
      cookieStore.get('__Secure-better-auth.session_token')?.value;

    if (!sessionToken) {
      return null;
    }

    // Use Better Auth's getSession function to validate the session
    const sessionResult = await auth.api.getSession({
      headers: {
        cookie: `better-auth.session_token=${sessionToken}`
      } as any
    });

    const session = sessionResult?.session;

    if (!session) {
      return null;
    }

    // Return a structure that matches what the tasks route expects
    // The session contains userId, so we can construct a user-like object
    return {
      ...session,
      user: {
        id: session.userId
      }
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

// Cached version to avoid multiple validations in the same request
export const getCachedSession = cache(validateSessionServer);
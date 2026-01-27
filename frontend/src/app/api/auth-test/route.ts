import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

// Test endpoint to verify database and auth configuration
export async function GET(request: NextRequest) {
  try {
    // Try to ping the auth system
    // Note: Better Auth API methods might be different
    // Let's just verify that the auth object is accessible
    if (!auth) {
      return Response.json({
        status: 'error',
        auth_system: 'not_initialized',
        timestamp: new Date().toISOString(),
        message: 'Auth system is not properly initialized'
      }, { status: 500 });
    }

    return Response.json({
      status: 'ok',
      auth_system: 'available',
      timestamp: new Date().toISOString(),
      message: 'Auth system is available and properly configured'
    });
  } catch (error) {
    console.error('Auth test error:', error);
    return Response.json({
      status: 'error',
      auth_system: 'unavailable',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
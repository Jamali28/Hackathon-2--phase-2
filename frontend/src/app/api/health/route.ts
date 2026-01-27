import { NextRequest } from 'next/server';
import { validateSessionServer } from '@/lib/auth-server';

// Health check endpoint to verify backend connectivity
export async function GET(request: NextRequest) {
  try {
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/health`;

    // Optional: Validate session if this endpoint requires authentication
    // Remove these lines if the health check should be public
    const session = await validateSessionServer();
    if (!session || !session.user) {
      // For health checks, we might want to allow unauthenticated access
      // If authentication is required, uncomment the following lines:
      /*
      return Response.json({ detail: 'Unauthorized - Invalid session' }, { status: 401 });
      */
    }

    // Forward the request to the backend
    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Pass user ID if needed for authenticated health checks
        // 'X-User-ID': session?.user?.id || '',
        // 'X-Proxy-Token': process.env.PROXY_AUTH_TOKEN || '',
      },
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({
        detail: 'Backend health check failed',
        status: backendResponse.status
      }));
      return Response.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return Response.json({
      frontend_status: 'ok',
      backend_status: 'ok',
      backend_response: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    return Response.json({
      frontend_status: 'error',
      backend_status: 'unknown',
      error: 'Failed to reach backend',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
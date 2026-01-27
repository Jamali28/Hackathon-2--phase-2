import { NextRequest } from 'next/server';
import { validateSessionServer } from '@/lib/auth-server';

// Test endpoint to verify backend connectivity with authentication
export async function GET(request: NextRequest) {
  try {
    // Validate session first
    const session = await validateSessionServer();

    if (!session || !session.user) {
      return Response.json({
        error: 'Not authenticated',
        backend_connected: false,
        auth_system: 'working',
        timestamp: new Date().toISOString()
      });
    }

    // Test backend connectivity
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/health`;

    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': session.user.id,
        'X-Proxy-Token': process.env.PROXY_AUTH_TOKEN || '',
      },
    });

    const backendData = await backendResponse.json().catch(() => ({
      status: 'Backend health check failed',
      timestamp: new Date().toISOString()
    }));

    return Response.json({
      auth_system: 'working',
      user_authenticated: true,
      user_id: session.user.id,
      backend_connected: backendResponse.ok,
      backend_status: backendResponse.status,
      backend_response: backendData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Backend test error:', error);
    return Response.json({
      auth_system: 'working',
      user_authenticated: false, // We can't determine this if there's an error
      backend_connected: false,
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
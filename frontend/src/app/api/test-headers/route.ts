import { NextRequest } from 'next/server';
import { validateSessionServer } from '@/lib/auth-server';

// Test endpoint to check if the proxy is correctly forwarding headers to the backend
export async function GET(request: NextRequest) {
  try {
    // Validate session first
    const session = await validateSessionServer();

    if (!session || !session.user) {
      return Response.json({
        error: 'Not authenticated',
        timestamp: new Date().toISOString()
      });
    }

    // Test the headers being sent to backend
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/test-headers`;

    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': session.user.id,
        'X-Proxy-Token': process.env.PROXY_AUTH_TOKEN || '',
      },
    });

    const backendData = await backendResponse.json().catch(() => ({
      error: 'Could not parse backend response',
      timestamp: new Date().toISOString()
    }));

    return Response.json({
      user_authenticated: true,
      user_id: session.user.id,
      backend_response: backendData,
      backend_status: backendResponse.status,
      proxy_headers_sent: {
        'X-User-ID': session.user.id,
        'X-Proxy-Token': process.env.PROXY_AUTH_TOKEN ? 'sent' : 'not set',
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Header test error:', error);
    return Response.json({
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
import { NextRequest } from 'next/server';
import { validateSessionServer } from '@/lib/auth-server';

// Debug endpoint to test backend connectivity
export async function GET(request: NextRequest) {
  try {
    // Test raw connectivity to backend without authentication
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/health`;

    console.log('Testing backend connectivity to:', backendUrl);

    let backendResponse;
    let backendError = null;

    try {
      backendResponse = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Backend response status:', backendResponse.status);
    } catch (fetchError) {
      console.error('Backend fetch error:', fetchError);
      backendError = (fetchError as Error).message;
    }

    // Test with authentication if user is logged in
    let session = null;
    let authBackendResponse = null;
    let authBackendError = null;

    try {
      session = await validateSessionServer();

      if (session && session.user) {
        const authBackendResponseRaw = await fetch(backendUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': session.user.id,
            'X-Proxy-Token': process.env.PROXY_AUTH_TOKEN || '',
          },
        });

        console.log('Auth backend response status:', authBackendResponseRaw.status);
        authBackendResponse = await authBackendResponseRaw.json().catch(() => ({
          error: 'Could not parse response'
        }));
      }
    } catch (authError) {
      console.error('Auth backend error:', authError);
      authBackendError = (authError as Error).message;
    }

    return Response.json({
      timestamp: new Date().toISOString(),
      environment: {
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
        proxyTokenSet: !!process.env.PROXY_AUTH_TOKEN,
      },
      rawConnectivity: {
        url: backendUrl,
        success: backendResponse ? backendResponse.ok : false,
        status: backendResponse ? backendResponse.status : null,
        error: backendError,
      },
      authenticatedConnectivity: {
        userAuthenticated: !!session,
        userId: session?.user?.id || null,
        success: authBackendResponse ? !authBackendError : false,
        error: authBackendError,
        response: authBackendResponse,
      },
      message: backendError ? `Cannot reach backend: ${backendError}` :
                (backendResponse && !backendResponse.ok) ? `Backend returned ${backendResponse.status}` :
                'Backend connection successful'
    });
  } catch (error) {
    console.error('Debug backend error:', error);
    return Response.json({
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
import { NextRequest } from 'next/server';
import { validateSessionServer } from '@/lib/auth-server';

// Proxy route for authentication endpoints that need to communicate with the backend
export async function GET(request: NextRequest) {
  return handleAuthRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleAuthRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return handleAuthRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return handleAuthRequest(request, 'DELETE');
}

async function handleAuthRequest(request: NextRequest, method: string) {
  try {
    // Extract the auth path after /api/auth-backend
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/api/auth-backend').filter(part => part !== '');
    const backendAuthPath = pathParts.length > 0 ? pathParts[0] : '';

    // Construct the backend URL for auth operations
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}${backendAuthPath}${url.search}`;

    // For authentication endpoints, we might not need session validation
    // depending on the specific endpoint
    let userId = null;
    const session = await validateSessionServer();

    if (session && session.user) {
      userId = session.user.id;
    }

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add user ID and proxy token if available
    if (userId) {
      headers['X-User-ID'] = userId;
    }
    if (process.env.PROXY_AUTH_TOKEN) {
      headers['X-Proxy-Token'] = process.env.PROXY_AUTH_TOKEN;
    }

    // Forward the request to the backend
    const requestBody = method !== 'GET' && method !== 'DELETE'
      ? await request.json()
      : undefined;

    const backendResponse = await fetch(backendUrl, {
      method,
      headers,
      body: requestBody ? JSON.stringify(requestBody) : undefined,
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({
        detail: `Backend auth error: ${backendResponse.status} ${backendResponse.statusText}`
      }));
      return Response.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return Response.json(data);
  } catch (error) {
    console.error('Auth proxy error:', error);
    return Response.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
import { NextRequest } from 'next/server';
import { validateSessionServer } from '@/lib/auth-server';

// Generic proxy route to forward requests to the backend
// This catches any API routes that aren't specifically implemented
export async function GET(request: NextRequest) {
  return handleRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return handleRequest(request, 'PUT');
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request, 'PATCH');
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, 'DELETE');
}

async function handleRequest(request: NextRequest, method: string) {
  try {
    // Extract the path after /api/proxy
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/api/proxy').filter(part => part !== '');
    const backendPath = pathParts.length > 0 ? pathParts[0] : '';

    // Construct the backend URL
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}${backendPath}${url.search}`;

    // Validate session if this is not a public endpoint
    // For public endpoints like health checks, we can skip validation
    let userId = null;
    if (!backendPath.includes('/health') && !backendPath.includes('/docs') && !backendPath.includes('/openapi.json')) {
      const session = await validateSessionServer();

      if (!session || !session.user) {
        return Response.json({ detail: 'Unauthorized - Invalid session' }, { status: 401 });
      }

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
        detail: `Backend error: ${backendResponse.status} ${backendResponse.statusText}`
      }));
      return Response.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return Response.json(data);
  } catch (error) {
    console.error('Generic proxy error:', error);
    return Response.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
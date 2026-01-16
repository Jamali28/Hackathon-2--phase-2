import { NextRequest } from 'next/server';
import { validateSessionServer } from '@/lib/auth-server';

// This is a proxy route that validates Better Auth session and forwards to FastAPI backend
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const sort = searchParams.get('sort') || 'created';

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/tasks?status=${status}&sort=${sort}`;

    // Validate session using our server-side validation function
    const session = await validateSessionServer();

    if (!session || !session.user) {
      return Response.json({ detail: 'Unauthorized - Invalid session' }, { status: 401 });
    }

    // Extract user ID from validated session
    const userId = session.user.id;

    // Create a shared secret for proxy authentication
    const proxyAuthToken = process.env.PROXY_AUTH_TOKEN;

    // Forward the request to the backend with the user ID
    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId,  // Pass user ID to backend
        'X-Proxy-Token': proxyAuthToken || '',
      },
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({ detail: 'Backend error' }));
      return Response.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return Response.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return Response.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/tasks`;

    // Validate session using our server-side validation function
    const session = await validateSessionServer();

    if (!session || !session.user) {
      return Response.json({ detail: 'Unauthorized - Invalid session' }, { status: 401 });
    }

    // Extract user ID from validated session
    const userId = session.user.id;

    // Create a shared secret for proxy authentication
    const proxyAuthToken = process.env.PROXY_AUTH_TOKEN;

    // Forward the request to the backend with the user ID
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId,  // Pass user ID to backend
        'X-Proxy-Token': proxyAuthToken || '',
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({ detail: 'Backend error' }));
      return Response.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error('Proxy error:', error);
    return Response.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(part => part !== '');
    const taskId = pathParts[pathParts.length - 1];

    const body = await request.json();
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`;

    // Validate session using our server-side validation function
    const session = await validateSessionServer();

    if (!session || !session.user) {
      return Response.json({ detail: 'Unauthorized - Invalid session' }, { status: 401 });
    }

    // Extract user ID from validated session
    const userId = session.user.id;

    // Create a shared secret for proxy authentication
    const proxyAuthToken = process.env.PROXY_AUTH_TOKEN;

    // Forward the request to the backend with the user ID
    const backendResponse = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId,  // Pass user ID to backend
        'X-Proxy-Token': proxyAuthToken || '',
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({ detail: 'Backend error' }));
      return Response.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return Response.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return Response.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(part => part !== '');
    const action = pathParts[pathParts.length - 1]; // "complete"
    const taskId = pathParts[pathParts.length - 2]; // "1"

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/${action}`;

    // Validate session using our server-side validation function
    const session = await validateSessionServer();

    if (!session || !session.user) {
      return Response.json({ detail: 'Unauthorized - Invalid session' }, { status: 401 });
    }

    // Extract user ID from validated session
    const userId = session.user.id;

    // Create a shared secret for proxy authentication
    const proxyAuthToken = process.env.PROXY_AUTH_TOKEN;

    // Forward the request to the backend with the user ID
    const backendResponse = await fetch(backendUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId,  // Pass user ID to backend
        'X-Proxy-Token': proxyAuthToken || '',
      },
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({ detail: 'Backend error' }));
      return Response.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return Response.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return Response.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(part => part !== '');
    const taskId = pathParts[pathParts.length - 1];

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`;

    // Validate session using our server-side validation function
    const session = await validateSessionServer();

    if (!session || !session.user) {
      return Response.json({ detail: 'Unauthorized - Invalid session' }, { status: 401 });
    }

    // Extract user ID from validated session
    const userId = session.user.id;

    // Create a shared secret for proxy authentication
    const proxyAuthToken = process.env.PROXY_AUTH_TOKEN;

    // Forward the request to the backend with the user ID
    const backendResponse = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId,  // Pass user ID to backend
        'X-Proxy-Token': proxyAuthToken || '',
      },
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({ detail: 'Backend error' }));
      return Response.json(errorData, { status: backendResponse.status });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Proxy error:', error);
    return Response.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
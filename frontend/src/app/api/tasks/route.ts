import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// This is a proxy route that validates Better Auth session and forwards to FastAPI backend
export async function GET(request: NextRequest) {
  // In a real implementation, we'd validate the Better Auth session here
  // For now, we'll just forward the request and let the backend handle auth
  // The cookies containing the session will be forwarded automatically

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const sort = searchParams.get('sort') || 'created';

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/tasks?status=${status}&sort=${sort}`;

    // Forward cookies to maintain session
    const cookieStore = cookies();
    const authCookies = [];
    for (const [name, value] of cookieStore.entries()) {
      if (name.includes('auth') || name.includes('session')) {
        authCookies.push(`${name}=${value}`);
      }
    }

    // Create a shared secret for proxy authentication
    const proxyAuthToken = process.env.PROXY_AUTH_TOKEN;

    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authCookies.length > 0 && { 'Cookie': authCookies.join('; ') }),
        'X-Proxy-Token': proxyAuthToken || '',  // Send proxy auth token
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

    // Forward cookies to maintain session
    const cookieStore = cookies();
    const authCookies = [];
    for (const [name, value] of cookieStore.entries()) {
      if (name.includes('auth') || name.includes('session')) {
        authCookies.push(`${name}=${value}`);
      }
    }

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authCookies.length > 0 && { 'Cookie': authCookies.join('; ') }),
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
    const pathParts = url.pathname.split('/');
    const taskId = pathParts[pathParts.length - 1];

    const body = await request.json();
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`;

    // Forward cookies to maintain session
    const cookieStore = cookies();
    const authCookies = [];
    for (const [name, value] of cookieStore.entries()) {
      if (name.includes('auth') || name.includes('session')) {
        authCookies.push(`${name}=${value}`);
      }
    }

    const backendResponse = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authCookies.length > 0 && { 'Cookie': authCookies.join('; ') }),
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
    const pathParts = url.pathname.split('/');
    const taskId = pathParts[pathParts.length - 2]; // e.g., /api/tasks/1/complete
    const action = pathParts[pathParts.length - 1];

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/${action}`;

    // Forward cookies to maintain session
    const cookieStore = cookies();
    const authCookies = [];
    for (const [name, value] of cookieStore.entries()) {
      if (name.includes('auth') || name.includes('session')) {
        authCookies.push(`${name}=${value}`);
      }
    }

    const backendResponse = await fetch(backendUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(authCookies.length > 0 && { 'Cookie': authCookies.join('; ') }),
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
    const pathParts = url.pathname.split('/');
    const taskId = pathParts[pathParts.length - 1];

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`;

    // Forward cookies to maintain session
    const cookieStore = cookies();
    const authCookies = [];
    for (const [name, value] of cookieStore.entries()) {
      if (name.includes('auth') || name.includes('session')) {
        authCookies.push(`${name}=${value}`);
      }
    }

    const backendResponse = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authCookies.length > 0 && { 'Cookie': authCookies.join('; ') }),
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
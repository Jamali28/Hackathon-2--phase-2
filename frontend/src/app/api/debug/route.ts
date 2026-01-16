import { NextRequest } from 'next/server';

// Debug endpoint for development/testing
export async function GET(request: NextRequest) {
  try {
    return Response.json({
      message: 'Debug endpoint is working',
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return Response.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
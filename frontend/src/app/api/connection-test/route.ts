import { NextRequest } from 'next/server';

// Comprehensive connection test endpoint
export async function GET(request: NextRequest) {
  const tests = [];

  // Test 1: Check if environment variables are properly set
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  tests.push({
    test: 'Environment Variables Check',
    status: apiUrl ? 'PASS' : 'FAIL',
    details: apiUrl ? `API URL is set to: ${apiUrl}` : 'NEXT_PUBLIC_API_URL is not set'
  });

  // Test 2: Try to reach the backend root
  try {
    const backendRootUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_API_URL;
    if (backendRootUrl) {
      // Remove '/api' suffix if present for the root check
      const rootUrl = backendRootUrl.replace(/\/api$/, '');

      const response = await fetch(`${rootUrl}/docs`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      tests.push({
        test: 'Backend Root Access',
        status: response.ok ? 'PASS' : 'FAIL',
        details: `Response: ${response.status} - ${response.statusText}`
      });
    } else {
      tests.push({
        test: 'Backend Root Access',
        status: 'FAIL',
        details: 'No backend URL configured'
      });
    }
  } catch (error) {
    tests.push({
      test: 'Backend Root Access',
      status: 'FAIL',
      details: `Error: ${(error as Error).message}`
    });
  }

  // Test 3: Try to reach the API health endpoint
  try {
    const apiHealthUrl = `${process.env.NEXT_PUBLIC_API_URL}/health`;
    const response = await fetch(apiHealthUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    tests.push({
      test: 'Backend API Health',
      status: response.ok ? 'PASS' : 'FAIL',
      details: `Response: ${response.status} - ${response.statusText}`
    });
  } catch (error) {
    tests.push({
      test: 'Backend API Health',
      status: 'FAIL',
      details: `Error: ${(error as Error).message}`
    });
  }

  // Test 4: Check if tasks endpoint is accessible
  try {
    const tasksUrl = `${process.env.NEXT_PUBLIC_API_URL}/tasks`;
    const response = await fetch(tasksUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    // We expect a 401 Unauthorized since we're not sending auth headers
    // That's actually a good sign - it means the endpoint exists
    const isValidResponse = response.status === 401 || response.status === 200 || response.status === 422;
    tests.push({
      test: 'Tasks Endpoint Accessibility',
      status: isValidResponse ? 'PASS' : 'FAIL',
      details: `Response: ${response.status} - ${response.statusText}. Expected 401 (unauthorized) or 200 (success) or 422 (validation error)`
    });
  } catch (error) {
    tests.push({
      test: 'Tasks Endpoint Accessibility',
      status: 'FAIL',
      details: `Error: ${(error as Error).message}`
    });
  }

  const allPassed = tests.every(test => test.status === 'PASS');

  return Response.json({
    overall_status: allPassed ? 'CONNECTED' : 'ISSUES_FOUND',
    timestamp: new Date().toISOString(),
    tests,
    summary: {
      total: tests.length,
      passed: tests.filter(t => t.status === 'PASS').length,
      failed: tests.filter(t => t.status === 'FAIL').length
    }
  });
}
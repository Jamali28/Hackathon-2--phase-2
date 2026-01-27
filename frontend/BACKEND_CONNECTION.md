# Frontend-Backend Connection Guide

This document explains how the frontend connects to the deployed backend service.

## Architecture Overview

The frontend uses a secure proxy pattern to communicate with the backend:

1. **Frontend API calls** → **Next.js API Routes** → **External Backend Service**
2. All requests are validated server-side for security
3. User sessions are verified before forwarding requests to the backend

## Configuration

The connection is configured using these environment variables in `frontend/.env`:

```env
NEXT_PUBLIC_API_URL=https://jamali28-todo-backend.hf.space/api
BETTER_AUTH_URL=https://jamali28-todo-backend.hf.space/api
PROXY_AUTH_TOKEN=dev-proxy-secret-token
```

## Proxy Routes

API requests follow this pattern:
- Frontend calls `/api/tasks` → Next.js route handles authentication → forwards to `https://jamali28-todo-backend.hf.space/api/tasks`

Currently implemented proxy routes:
- `/api/tasks` - Handles all task-related operations (GET, POST, PUT, PATCH, DELETE)
- `/api/health` - Health check for backend connectivity
- `/api/proxy/[...path]` - Generic proxy for other backend endpoints

## Security Features

- Session validation occurs server-side before forwarding requests
- User ID is passed to backend via `X-User-ID` header
- Proxy authentication token adds an extra security layer
- All sensitive data remains on the server-side

## Testing Connectivity

To test the connection to your backend:
1. Visit `/api/health` endpoint to verify connectivity
2. Check that task operations work properly in the UI
3. Verify that authentication flows work correctly
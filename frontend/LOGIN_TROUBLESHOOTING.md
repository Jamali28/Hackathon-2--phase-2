# Login Troubleshooting Guide

This guide helps troubleshoot common login issues when connecting the frontend to the backend.

## Common Issues and Solutions

### 1. "Failed to fetch" Error During Login

**Possible Causes:**
- Database connection issues
- Network connectivity problems
- CORS configuration issues
- Authentication endpoint misconfiguration

**Solutions:**
1. Verify that your `DATABASE_URL` in `.env` is correct and accessible
2. Ensure your PostgreSQL database allows connections from your deployment environment
3. Check that your deployment platform (e.g., Vercel) can reach your Neon database

### 2. Environment Variable Issues

Make sure your `.env` file contains:

```env
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=https://your-deployment-url.vercel.app
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
NEXT_PUBLIC_APP_URL=https://your-deployment-url.vercel.app
NEXT_PUBLIC_API_URL=https://your-backend-url/api
PROXY_AUTH_TOKEN=your-proxy-token
```

### 3. Database Connection Problems

Verify your Neon PostgreSQL database:
- Ensure the connection string is correct
- Check that SSL is properly configured
- Verify that the database is accessible from your deployment environment

### 4. Authentication Flow

The authentication flow works as follows:
1. User interacts with login/signup forms on frontend
2. Requests go to `/api/auth/[...auth]` routes on Next.js server
3. Better Auth handles authentication using the configured database
4. Session cookies are set and managed by Better Auth
5. Subsequent API calls to backend services are validated via proxy routes

### 5. Testing Steps

1. **Check database connection**: Verify that your Next.js app can connect to the Neon database
2. **Test auth endpoints**: Visit `/api/auth/session` to check if auth is working
3. **Verify proxy routes**: Test `/api/health` to ensure backend connectivity
4. **Check browser console**: Look for CORS errors or network failures

### 6. Debugging Commands

Run these commands to diagnose issues:

```bash
# Check if auth endpoints are accessible
curl -v https://your-app.vercel.app/api/auth/csrf

# Check backend connectivity
curl -v https://your-app.vercel.app/api/health
```

### 7. Common Fixes

If login still fails:

1. Clear browser cookies and try again
2. Ensure your `BETTER_AUTH_SECRET` is consistent across environments
3. Verify that your database migration has run successfully
4. Check the server logs for specific error messages
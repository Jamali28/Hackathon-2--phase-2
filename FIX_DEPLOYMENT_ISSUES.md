# Fixing Authentication Issues Between Local and Vercel Deployments

## Problem Description
- Local frontend works fine with backend authentication
- Vercel deployed frontend fails to authenticate with backend
- Tasks are not being created/saved when using deployed frontend

## Root Cause
The issue is likely due to incorrect environment variables in the Vercel deployment. The frontend acts as a proxy between the client and backend, and both sides need matching authentication tokens.

## Solution Steps

### 1. Update Vercel Environment Variables

Set these environment variables in your Vercel dashboard (Settings > Environment Variables):

```env
NEXT_PUBLIC_API_URL=https://your-backend-deployment.hf.space/api
BETTER_AUTH_URL=https://your-vercel-deployment.vercel.app
DATABASE_URL=your_neon_database_url
PROXY_AUTH_TOKEN=your_secure_proxy_token
BETTER_AUTH_SECRET=your_auth_secret
NEXT_PUBLIC_APP_URL=https://your-vercel-deployment.vercel.app
```

### 2. Update Backend Environment Variables

Make sure your backend (Hugging Face Space or other deployment) has:

```env
PROXY_AUTH_TOKEN=your_secure_proxy_token  # Same as in Vercel
DATABASE_URL=your_postgres_database_url
BETTER_AUTH_URL=https://your-vercel-deployment.vercel.app  # Points to your Vercel deployment
```

### 3. Verify CORS Settings

In your backend's main.py, make sure CORS allows your Vercel domain:

```python
default_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://localhost:3000",
    "https://localhost:3001",
    "https://*.hf.space",
    "https://*.huggingface.co",
    "https://your-vercel-deployment.vercel.app"  # Add your Vercel domain
]
```

### 4. Test the Connection

After updating the environment variables:

1. Redeploy your Vercel frontend
2. Test the health endpoint: `https://your-vercel-deployment.vercel.app/api/health`
3. Try logging in and creating a task

### 5. Debugging Steps

If issues persist:

1. Check the browser console for errors
2. Check your Vercel logs for proxy errors
3. Verify that your backend logs show incoming requests from the proxy
4. Ensure the `X-User-ID` and `X-Proxy-Token` headers are being sent correctly

### 6. Important Notes

- The `PROXY_AUTH_TOKEN` must be identical in both frontend (Vercel) and backend deployments
- The `BETTER_AUTH_URL` in backend should point to your Vercel deployment URL
- The `NEXT_PUBLIC_API_URL` in frontend should point to your backend deployment URL
- Both deployments need access to the same database for user accounts to sync

### 7. Verification Commands

You can test the proxy functionality with these commands:

```bash
# Test health check from frontend to backend
curl -v https://your-vercel-deployment.vercel.app/api/health

# Test if proxy is working
curl -v https://your-vercel-deployment.vercel.app/api/tasks
```

### 8. Troubleshooting Checklist

- [ ] Environment variables are set correctly in both deployments
- [ ] Proxy authentication tokens match
- [ ] CORS settings allow communication between domains
- [ ] Database is accessible from both deployments
- [ ] Authentication flow works end-to-end
- [ ] User IDs are being passed correctly from frontend to backend
# Development Environment Troubleshooting

This guide addresses common issues encountered when running the development server.

## Turbopack vs Webpack Issues

### Problem:
```
ERROR: This build is using Turbopack, with a `webpack` config and no `turbopack` config.
```

### Solution:
The project now uses webpack instead of Turbopack by default. The `npm run dev` command runs with `--turbo false` flag to ensure compatibility with the webpack configuration.

If you encounter issues, you can also run:
```bash
npm run dev -- --turbo false
```

## Running the Development Server

### Correct way to start development:
```bash
npm run dev
```

This will run the server with webpack instead of Turbopack, which is compatible with the current webpack configuration in `next.config.ts`.

## Authentication Issues in Development

### Common Login Issues:
1. **"Failed to fetch" errors** - Usually related to database connectivity
2. **Session issues** - May require clearing browser cookies
3. **Environment variable issues** - Verify all required env vars are set

### Verifying Authentication:
- Visit `/api/auth-test` to verify auth system is working
- Visit `/api/health` to verify backend connectivity
- Visit `/api/connection-test` to run full connection diagnostics

## Environment Variables

Make sure your `.env.local` file contains all required variables:
```env
BETTER_AUTH_SECRET=your-secret
DATABASE_URL=your-neon-db-url
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://your-backend-url/api
PROXY_AUTH_TOKEN=your-proxy-token
```

## Testing API Routes

The following test endpoints are available:
- `/api/health` - Backend connectivity test
- `/api/connection-test` - Full connection diagnostics
- `/api/auth-test` - Authentication system test
- `/api/tasks` - Main API functionality (requires authentication)

## Database Connectivity

Ensure your Neon PostgreSQL database is accessible from your development environment. You may need to adjust database connection pool settings for local development.
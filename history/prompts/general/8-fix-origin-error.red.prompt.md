---
id: 8
title: "Fix Origin Error"
stage: "red"
date: "2026-01-28"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "main"
user: "muhee"
command: "sp.phr"
labels: ["authentication", "origin", "cors", "better-auth", "error-fix"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "frontend/src/lib/auth.ts"
  - "frontend/.env"
tests: []
---

# Fix Origin Error

## Context
The user was experiencing authentication failures due to Better Auth rejecting requests from localhost.

## Prompt Text
remember the main issue was connection error on backend
✓ Ready in 2.5s
GET / 200 in 4.1s (compile: 2.7s, proxy.ts: 244ms, render: 1157ms)
GET /signup 200 in 316ms (compile: 198ms, proxy.ts: 33ms, render: 85ms)
2026-01-27T22:32:28.903Z ERROR [Better Auth]: Invalid origin: http://localhost:3000
POST /api/auth/sign-up/email 403 in 4.0s (compile: 3.9s, render: 136ms)
2026-01-27T22:32:33.496Z ERROR [Better Auth]: Invalid origin: http://localhost:3000
POST /api/auth/sign-up/email 403 in 139ms (compile: 59ms, render: 80ms)
2026-01-27T22:32:33.821Z ERROR [Better Auth]: Invalid origin: http://localhost:3000
POST /api/auth/sign-up/email 403 in 27ms (compile: 8ms, render: 19ms)

## Response Text
Fixed the origin error by configuring Better Auth to allow localhost in development and updating the environment variables.

## Work Performed
- Updated auth.ts to conditionally allow localhost for development
- Updated .env to use localhost URL for development
- Configured proper origin handling for both dev and prod environments
- Resolved the "Invalid origin" error during authentication

## Outcome Impact
Authentication now works properly in development environment with localhost origin allowed.

## Files Modified
- frontend/src/lib/auth.ts: Added conditional origin configuration
- frontend/.env: Updated to use localhost for development

## Tests Summary
Authentication requests should now succeed without origin errors

## Next Prompts
None needed - origin configuration is properly set

## Reflection Note
Better Auth requires explicit origin configuration to allow cross-origin requests during authentication.
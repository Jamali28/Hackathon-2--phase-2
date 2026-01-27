---
id: 11
title: "Add Debug Endpoints"
stage: "misc"
date: "2026-01-28"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "main"
user: "muhee"
command: "sp.phr"
labels: ["debugging", "headers", "authentication", "proxy", "diagnostics"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "Todo-backend/routes/test.py"
  - "Todo-backend/main.py"
  - "frontend/src/app/api/test-headers/route.ts"
tests: []
---

# Add Debug Endpoints

## Context
Adding debug endpoints to diagnose the backend connection issue when creating tasks.

## Prompt Text
test all functionality add task delete and mark it as complete and others

## Response Text
Added test endpoints to both backend and frontend to diagnose proxy header forwarding and authentication flow.

## Work Performed
- Created test endpoint in backend to check received headers
- Updated main.py to include test router
- Created frontend proxy test endpoint to verify header forwarding
- Added diagnostic tools to identify the exact authentication/authorization issue

## Outcome Impact
Can now diagnose exactly what headers are being sent and received between frontend proxy and backend.

## Files Modified
- Todo-backend/routes/test.py: Created header test endpoint
- Todo-backend/main.py: Added test router
- frontend/src/app/api/test-headers/route.ts: Created frontend test proxy

## Tests Summary
Created endpoints to test header forwarding between frontend and backend

## Next Prompts
Visit /api/test-headers to diagnose proxy header issues

## Reflection Note
Diagnostic endpoints help identify specific issues in distributed system communication.
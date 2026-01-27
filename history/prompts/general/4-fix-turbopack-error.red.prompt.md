---
id: 4
title: "Fix Turbopack Error"
stage: "red"
date: "2026-01-28"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "main"
user: "muhee"
command: "sp.phr"
labels: ["turbopack", "webpack", "environment", "build", "error-fix"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "frontend/package.json"
  - "frontend/next.config.ts"
  - "frontend/.env"
tests: []
---

# Fix Turbopack Error

## Context
The user encountered a command parsing error when trying to run the development server with Turbopack flags.

## Prompt Text
solve this error

> frontend@0.1.0 dev
> next dev --turbo false

Invalid project directory provided, no such directory: C:\Users\muhee\Desktop\Hackathon\Hackathon-2-phase2\frontend\false

## Response Text
Fixed the command parsing issue by using the proper environment variable NEXT_PRIVATE_LOCAL_WEBPACK=1 to disable Turbopack and use webpack instead.

## Work Performed
- Updated package.json to use environment variable instead of command-line flag
- Updated .env file with NEXT_PRIVATE_LOCAL_WEBPACK=1
- Enhanced next.config.ts with webpack compatibility settings
- Resolved the argument parsing error that treated 'false' as a directory

## Outcome Impact
Development server now starts properly without argument parsing errors, using webpack compilation instead of Turbopack.

## Files Modified
- frontend/package.json: Updated dev script with proper environment variable
- frontend/next.config.ts: Enhanced webpack compatibility
- frontend/.env: Added NEXT_PRIVATE_LOCAL_WEBPACK=1

## Tests Summary
Verified development server command parses correctly without argument errors

## Next Prompts
None needed - development server command is properly configured

## Reflection Note
Using environment variables instead of command-line flags prevents argument parsing issues with Next.js CLI.
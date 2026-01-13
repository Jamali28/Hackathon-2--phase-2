# Research: FastAPI Backend Implementation

## Decision: Better Auth JWT Verification Pattern
- **Decision**: Verify JWTs in FastAPI using `pyjwt` or `jose` libraries with the shared `BETTER_AUTH_SECRET`.
- **Rationale**: The Next.js frontend is already configured with the Better Auth JWT plugin. By sharing the secret, the backend can autonomously verify user identity without performing an extra database roundtrip or cross-server request to the Next.js auth server.
- **Alternatives considered**:
  - Token Introspection: Rejected due to latency (requires extra request).
  - Database Session Check: Rejected because it breaks statelessness and adds DB load.

## Decision: Async Neon Connection with SQLModel
- **Decision**: Use `async_engine` from `sqlalchemy.ext.asyncio` with the `psycopg` driver.
- **Rationale**: SQLModel (built on SQLAlchemy) supports async drivers, ensuring non-blocking I/O for high-performance requests, aligning with FastAPI's core design.
- **Consistency**: Matches `@skills/neon-db-connection.md`.

## Decision: Frontend-Backend Integration Bridge
- **Decision**: Update `api-client.ts` to use `localStorage` for retrieving the Better Auth token and pointing to `http://localhost:8000`.
- **Rationale**: Immediate swap from mock data to real API requires a standard fetch wrapper that handles Authorization headers automatically.

## Decision: Ownership Enforcement Middleware
- **Decision**: Implement ownership checks within the route handlers rather than a global middleware.
- **Rationale**: It allows for granular control and specific 403 vs 404 responses depending on whether the task exists vs whether the user owns it.

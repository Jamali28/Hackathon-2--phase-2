# Frontend Research: Next.js 16 SaaS Patterns

## Decision: Next.js 16 + App Router
- **Rationale**: Next.js 16 provides the most robust framework for Server Components, improving performance for high-traffic SaaS apps.
- **Alternatives**: Vite + SPA (Rejected due to lack of native SSR and SEO optimization).

## Best Practices: Component Primitives
- **Package**: `@headlessui/react` for unstyled, accessible UI logic.
- **Decision**: Use `clsx` and `tailwind-merge` for clean, conditional class management in reusable components.

## Patterns: Authentication & JWT
- **Decision**: `Better Auth` with JWT plugin is the most secure method for sharing sessions between Next.js and FastAPI without a centralized session store.
- **JWT Storage**: Managed by Better Auth; passed via `Authorization` header in a custom API fetch wrapper.

## Design Decision: Inter Font & 4px Grid
- **Rationale**: Industry standard for SaaS apps; provides a clean, neutral, and professional data-dense layout.

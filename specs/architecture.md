# Architecture Specification: Frontend

## Architecture Overview
The application utilizes the Next.js App Router for a robust, file-system-based routing architecture. It prioritizes Server Components for performance and SEO, with Client Components reserved for interactivity.

## File Organization
```text
frontend/
├── app/                  # App Router pages and layouts
├── components/           # Reusable UI components (atomic design)
│   ├── ui/               # Primary UI primitives (buttons, inputs)
│   ├── layout/           # Shared layout components (navbar, footer)
│   └── modules/          # Feature-specific components (task-list, auth-form)
├── lib/                  # Utilities, hooks, and API clients
├── hooks/                # Custom React hooks
├── providers/            # Context providers (auth, theme)
└── types/                # TypeScript interfaces and types
```

## Design System Integration
- **Global CSS**: Tailwind directives and base layer customizations in `app/globals.css`.
- **Theme Provider**: `next-themes` implementation for dark/light mode toggle.
- **Components**: Styled primitives with TypeScript props and Tailwind variants.

## State Management
- **Server Components**: Used for initial data fetching and page structure.
- **Client Components**: Used for:
  - Form handling (React Hook Form + Zod)
  - Interactive UI (Modals, Dropdowns)
  - Flash notifications (Toasts)
- **Data Revalidation**: Utilizing Next.js `revalidatePath` and `revalidateTag` for consistent state.

## API Integration
- **Secure Client**: A fetch wrapper that automatically attaches the `Authorization: Bearer <JWT>` header from Better Auth.
- **Error Handling**: Standardized catch blocks to surface backend errors (401, 404, 422) to the UI.
- **Loading States**: Native `loading.tsx` and custom skeletons for granular feedback.

## Routing & Security
- **Protected Routes**: Middleware-based auth guards. Unauthenticated users are redirected from `/dashboard` and `/profile` to `/login`.
- **Public Routes**: `/`, `/login`, `/signup`.

Spec complete. Ready for implementation by @agents/frontend-developer.md using professional UI patterns

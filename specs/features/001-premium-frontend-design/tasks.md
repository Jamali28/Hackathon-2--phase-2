# Tasks: Premium Frontend Design

**Input**: Design documents from `/specs/` and `plan/frontend-plan.md`
**Prerequisites**: plan/frontend-plan.md, specs/overview.md, specs/architecture.md, specs/features/authentication.md, specs/features/task-crud.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 (Authentication), US2 (Task Management)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic design system configuration

- [ ] T001 Initialize Next.js 16+ project with `npx create-next-app@latest frontend --typescript --tailwind --eslint`
- [ ] T002 Install dependencies: `@tailwindcss/forms`, `@headlessui/react`, `react-hook-form`, `zod`, `lucide-react`, `clsx`, `tailwind-merge`, `next-themes`
- [ ] T003 Configure `frontend/tailwind.config.ts` with custom colors (blue/green/red-600), spacing (4px grid), and animations
- [ ] T004 [P] Setup `Inter` font in `frontend/app/layout.tsx`
- [ ] T005 Setup `ThemeProvider` from `next-themes` in `frontend/providers/theme-provider.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core UI primitives and API utilities

- [ ] T006 [P] Create `Button` primitive in `frontend/components/ui/button.tsx` with premium variants
- [ ] T007 [P] Create `Input` primitive in `frontend/components/ui/input.tsx` with active/error states
- [ ] T008 [P] Create `Card` primitive in `frontend/components/ui/card.tsx` with hover lifts
- [ ] T009 [P] Create `Modal` component in `frontend/components/ui/modal.tsx` with backdrop blur
- [ ] T010 [P] Implement `LoadingSpinner` in `frontend/components/ui/loading-spinner.tsx`
- [ ] T011 [P] Setup standardized `API Client` wrapper in `frontend/lib/api-client.ts` with JWT header logic

---

## Phase 3: User Story 1 - Authentication (Priority: P1) 🎯 MVP

**Goal**: Seamless signup/signin with toast notifications and protected routes

**Independent Test**: User can signup, login, stay persisted, and be redirected from `/login` to `/dashboard`.

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create Auth layouts in `frontend/app/(auth)/layout.tsx` (centered gradient backgrounds)
- [ ] T013 [US1] Implement Login page in `frontend/app/(auth)/login/page.tsx` with Zod validation
- [ ] T014 [US1] Implement Signup page in `frontend/app/(auth)/signup/page.tsx`
- [ ] T015 [US1] Integrate `Better Auth` client in `frontend/lib/auth-client.ts`
- [ ] T016 [US1] Create `Navbar` with login/signup buttons and user dropdown in `frontend/components/layout/navbar.tsx`
- [ ] T017 [US1] Implement Auth middleware in `frontend/middleware.ts` for protected route guards

**Checkpoint**: User Story 1 (Auth) fully functional and testable.

---

## Phase 4: User Story 2 - Task Management (Priority: P2)

**Goal**: Full Task CRUD with professional UI and real-time filtering

**Independent Test**: Logged-in user can create, list, filter, edit, and delete tasks with instant UI feedback.

### Implementation for User Story 2

- [ ] T018 [P] [US2] Create Task List page in `frontend/app/(dashboard)/dashboard/page.tsx`
- [ ] T019 [P] [US2] Implement `TaskCard` component in `frontend/components/modules/task-card.tsx`
- [ ] T020 [US2] Implement `TaskForm` in `frontend/components/modules/task-form.tsx` (create/edit)
- [ ] T021 [US2] Add debounced `Search` bar in `frontend/components/modules/task-search.tsx`
- [ ] T022 [US2] Implement Status/Priority filtering dropdown in `frontend/components/modules/task-filters.tsx`
- [ ] T023 [US2] Add empty state illustrations in `frontend/components/ui/empty-state.tsx`
- [ ] T024 [US2] Add loading skeletons in `frontend/app/(dashboard)/dashboard/loading.tsx`

**Checkpoint**: Task CRUD fully functional with user isolation.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final UI refinements and accessibility hardening

- [ ] T025 [P] Implement `Toast` notification system in `frontend/components/ui/toast.tsx`
- [ ] T026 Add smooth 200ms transitions to all interactive components
- [ ] T027 [P] Perform ARIA audit and add necessary labels across all pages
- [ ] T028 Final responsive testing (Mobile -> Tablet -> Desktop)
- [ ] T029 Implement error boundaries in `frontend/app/error.tsx`

---

## Dependencies & Execution Order

1. **Setup (Phase 1)**: Must be completed first to establish the Next.js environment.
2. **Foundational (Phase 2)**: Primitive components are needed for all pages.
3. **User Story 1 (P1)**: High priority; required for session-based API calls.
4. **User Story 2 (P2)**: Depends on Phase 1 & 2; integrates with Phase 3 for data isolation.
5. **Polish**: Final refinement after all core features are stable.

## Parallel Execution Examples

```bash
# Core Primitives
Task: "Create Button primitive in frontend/components/ui/button.tsx"
Task: "Create Card primitive in frontend/components/ui/card.tsx"

# Auth UI
Task: "Implement Login page in frontend/app/(auth)/login/page.tsx"
Task: "Implement Signup page in frontend/app/(auth)/signup/page.tsx"
```

## Implementation Strategy

- **MVP**: Complete Phase 1-3 to have a working authenticated user shell.
- **Incremental**: Add Task Management (Phase 4), then Polish (Phase 5).

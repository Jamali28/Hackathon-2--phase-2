# Tasks: FastAPI Todo Backend

**Input**: Design documents from `specs/features/002-fastapi-todo-backend/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize backend project with `pip install fastapi uvicorn sqlmodel psycopg PyJWT python-dotenv`
- [ ] T002 [P] Create backend `.env.example` with placeholders for database and auth secrets
- [ ] T003 [P] Configure `.gitignore` for backend (node_modules if any, __pycache__, .env)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Implement async database connection and session management in `backend/db.py`
- [ ] T005 [P] Implement JWT verification utility in `backend/dependencies.py`
- [ ] T006 [P] Create base `Task` model definition in `backend/models.py`
- [ ] T007 Initialize FastAPI app with CORS middleware in `backend/main.py`
- [ ] T008 [P] Setup API router prefix and basic error handlers in `backend/main.py`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Secure Task Creation (Priority: P1) 🎯 MVP

**Goal**: Authenticated users can create tasks with a title and optional description.

**Independent Test**: Verify via Postman/Curl that a POST request with a valid JWT creates a task in Neon and returns the task ID.

### Implementation for User Story 1

- [ ] T009 [P] [US1] Define `TaskCreate` and `TaskRead` Pydantic schemas in `backend/models.py`
- [ ] T010 [P] [US1] Implement `get_current_user` dependency in `backend/dependencies.py` (extracts sub claim)
- [ ] T011 [US1] Implement POST `/api/tasks` endpoint in `backend/routes/tasks.py`
- [ ] T012 [US1] Integrate `tasks` router into `backend/main.py`
- [ ] T013 [US1] Validate title length (1-200 chars) and ownership persistence in `backend/routes/tasks.py`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - User-Isolated Task Management (Priority: P1)

**Goal**: Users can list, view, and delete ONLY their own tasks.

**Independent Test**: Login as two different users; verify User A cannot fetch or delete User B's task by ID.

### Implementation for User Story 2

- [ ] T014 [P] [US2] Implement GET `/api/tasks` with user_id filtering in `backend/routes/tasks.py`
- [ ] T015 [P] [US2] Implement GET `/api/tasks/{id}` with ownership check in `backend/routes/tasks.py`
- [ ] T016 [US2] Implement DELETE `/api/tasks/{id}` with 403/404 ownership logic in `backend/routes/tasks.py`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Task Status and Organization (Priority: P2)

**Goal**: Support status filtering and completion toggling.

**Independent Test**: Toggle a task's status via PATCH and verify the list endpoint filters correctly by status.

### Implementation for User Story 3

- [ ] T017 [P] [US3] Implement PATCH `/api/tasks/{id}/complete` toggle in `backend/routes/tasks.py`
- [ ] T018 [US3] Add `status` (all|pending|completed) filter to GET `/api/tasks` in `backend/routes/tasks.py`
- [ ] T019 [US3] Add `sort` (created|title) parameter to GET `/api/tasks` in `backend/routes/tasks.py`

---

## Phase 6: Frontend - Integration & API Client

**Purpose**: Replace frontend mock logic with real FastAPI backend calls.

- [ ] T020 [P] Update `frontend/src/lib/api-client.ts` to point to `http://localhost:8000/api`
- [ ] T021 Update `frontend/src/app/(dashboard)/dashboard/page.tsx` to fetch tasks from backend on load
- [ ] T022 Replace `localStorage` mock logic in `dashboard/page.tsx` with `api.post`, `api.patch`, and `api.delete` calls
- [ ] T023 [P] Ensure JWT is retrieved from Better Auth cookies/localStorage and attached via `api-client.ts`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T024 Fix any CORS or pre-flight issues between port 3000 and 8000
- [ ] T025 Run quickstart.md validation steps for full-stack flow
- [ ] T026 [P] Cleanup backend `__pycache__` and create final `backend/requirements.txt`
- [ ] T027 Final verification: Signup → Login → Add Task → Refresh → Ensure data stays.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all routes.
- **User Stories (Phase 3-5)**: All depend on Phase 2. US1 is the highest priority.
- **Integration (Phase 6)**: Depends on backend endpoints being functional.

### Parallel Opportunities

- All tasks marked [P] can run in parallel.
- Once Phase 2 is done, US1, US2, and US3 implementation can proceed in parallel within the `backend/routes/tasks.py` file if managed carefully.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Setup + Foundational.
2. Complete US1 (Create) + US2 (List/Delete).
3. Integrate US1/US2 into Frontend.
4. **STOP and VALIDATE**: Real data persistence works.

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Verify 401/403/404 handling in US2/US3 for security.

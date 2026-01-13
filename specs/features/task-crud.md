# Feature Specification: Task CRUD (Premium UI)

## Professional Task UI
- **Dashboard**: Clean grid layout with sidebar navigation. Main area uses a white/dark-gray surface with soft borders.
- **Task Cards**: Interactive cards that lift on hover (`hover:-translate-y-1 hover:shadow-lg transition-all`).

## User Stories
- **Creation**: As a user, I want a premium "New Task" form with a collapsible layout, character counters, and priority selection.
- **Viewing**: As a user, I want to see my tasks in a responsive list that supports infinite scrolling.
- **Editing**: As a user, I want to edit task details inline or via a beautiful modal with backdrop blur.
- **Completion**: As a user, I want a satisfying checkbox animation when I complete a task.
- **Deletion**: As a user, I want a confirmation modal before a task is permanently deleted.

## Acceptance Criteria
- [ ] **Validation**: Task title must be 1-200 characters. Error state triggers if empty or too long.
- [ ] **Badges**: Status badges (`Pending`: Yellow, `Completed`: Green) and Priority badges (`High`: Red, `Medium`: Orange, `Low`: Blue). *Default priority is Medium.*
- [ ] **Filtering**: A professional dropdown menu to filter by status and a search bar for real-time, debounced title-based filtering.
- [ ] **Sorting**: Ability to sort by `created_at` (desc/asc) with visual sort indicators.
- [ ] **Empty States**: An illustrated "No tasks yet" state when the list is empty.
- [ ] **Mobile Experience**: Large touch targets and swipe-to-complete functionality.

## Technical Rules
- Multi-user isolation enforced by `user_id` from JWT.
- API endpoints: `/api/tasks`.

## Clarifications
### Session 2026-01-06
- Q: What should be the default priority level assigned to a new task if none is selected? → A: Medium (Option B)
- Q: Should search results update in real-time as the user types? → A: Real-time (Debounced) (Option A)

Spec complete. Ready for implementation by @agents/frontend-developer.md using professional UI patterns

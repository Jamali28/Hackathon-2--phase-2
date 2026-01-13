# Feature Specification: Authentication (Premium UI)

## Beautiful Auth UI
- **Visuals**: Centered forms on a soft gradient background (`bg-gradient-to-br from-blue-50 to-indigo-100` for light, `from-gray-900 to-indigo-950` for dark).
- **Form Card**: `backdrop-blur-md`, subtle border, and soft shadow for a "Glassmorphism" effect.

## User Stories
- **Signup**: As a user, I want a multi-field signup form with real-time password strength indicators.
- **Signin**: As a user, I want a clean login screen that remembers my session.
- **Password Management**: As a user, I want "Forgot Password" functionality and clear error messages for invalid attempts.
- **Social**: Placeholder buttons for "Continue with Google/GitHub" to prepare for future scaling.

## Acceptance Criteria
- [ ] Users can login and receive a valid session that remains active for 7 days.
- [ ] **Form Validation**: Real-time feedback using React Hook Form + Zod. Fields turn red on error and green on valid input.
- [ ] **Interactive Feedback**: All buttons show a `LoadingSpinner` when a request is in flight and disable user input.
- [ ] **Notifications**: `Success` or `Error` toast notifications appear atop the screen for all auth events.
- [ ] **Redirects**: Automatic navigation to `/dashboard` upon verification of a valid JWT.
- [ ] **Error Clarity**: Display human-friendly messages: "Email already exists" or "Check your password and try again".

## Technical Integration
- Uses **Better Auth** with the JWT plugin.
- Secret: `BETTER_AUTH_SECRET` environment variable.

## Clarifications
### Session 2026-01-06
- Q: How long should a user's session remain valid by default? → A: 7 Days (Option B)

Spec complete. Ready for implementation by @agents/frontend-developer.md using professional UI patterns

# UI Specification: Pages

## Route Structure

### `/` (Landing Page)
- **Goal**: Conversion and brand presentation.
- **Hero Section**: Large typography, "Get organized instantly" headline, and a "Get Started for Free" primary CTA.
- **Features Grid**: Three-column display showing: "Secure & Private", "Multi-device Sync", "Modern Interface".
- **Visuals**: Abstract UI screenshots or high-quality SVG illustrations.

### `/login` & `/signup`
- **Goal**: Seamless entry.
- **Layout**: Centered card (max-w-md), toggle link between Login/Signup at the bottom.
- **Design**: Brand logo at the top, social auth placeholders, and high-contrast email/password forms.

### `/dashboard` (Protected)
- **Goal**: Efficient task management.
- **Layout**:
  - **Sidebar**: App logo, navigation links (Tasks, Categories, Profile), and logout at the bottom.
  - **Main**: Page header with "Welcome back, [User]", current stats (Total/Pending), and the primary Task List.
- **Interactivity**: Floating Action Button (FAB) for "New Task" on mobile.

### `/tasks/new` & `/tasks/[id]`
- **Goal**: Content entry and editing.
- **UI**: Full-screen modal overlay with backdrop blur. Focused form layout with clean "Save" and "Cancel" actions.

### `/profile` (Protected)
- **Goal**: Personalization.
- **Sections**:
  - Avatar and Email management.
  - Appearance settings (Light/Dark/System toggle).
  - Security settings (Change password).

## Root Layout Requirements
- **Providers**: `ThemeProvider` (next-themes) and `AuthProvider`.
- **Global Components**: `Navbar` (responsive), `Footer` (minimalist), and `Toaster` for notifications.

Spec complete. Ready for implementation by @agents/frontend-developer.md using professional UI patterns

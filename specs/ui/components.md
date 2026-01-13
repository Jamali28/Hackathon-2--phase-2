# UI Specification: Component Library

## Primary Components

### Button
- **Variants**: `primary` (blue-600), `secondary` (gray-200), `ghost`, `destructive` (red-600).
- **Features**: `isLoading` state (shows spinner, disables interaction), `disabled` state, `rounded-lg` padding.

### Card
- **Design**: White or dark-gray surface, `1px` border, subtle shadow.
- **Sections**: Header (title/actions), Content (main data), Footer (meta/secondary actions).

### Input & Textarea
- **Design**: Clean borders, `focus:ring-2 focus:ring-blue-600` focus state.
- **Features**: Attached labels, validation error text (red), character counters for tasks.

### Modal
- **Design**: Backdrop blur (`backdrop-blur-sm`), centered, `rounded-2xl`, smooth scale-in animation.
- **Behavior**: Close on escape, click-outside to close.

### TaskCard (Rich)
- **Elements**: Checkbox with animation, title, priority badge, and an ellipsis menu for `Edit/Delete`.
- **States**: Different styling for `completed` tasks (opacity-50, strikethrough).

### Navbar
- **Responsive**: Desktop sidebar + horizontal top-bar; Mobile hamburger menu with slide-out animation.
- **User Dropdown**: Clicking user avatar reveals `Profile`, `Settings`, and `Logout`.

## Feedback & Indicators

### Toast
- Beautiful auto-dismiss notifications. Icons for Success (Check), Error (X), Info (i). Support for swipe-to-close.

### LoadingSpinner
- SVG-based, CSS animation for 360-degree rotation. Used on buttons and page transitions.

### Badge
- Small, rounded pills. `bg-opacity-10` colors for statuses (e.g., green text on light-green bg for `Completed`).

### Dropdown / Select
- Custom-styled select menus with search support and keyboard navigation.

## Quality Standards
- **Typography**: All text MUST use the Inter font.
- **Animation**: All hover/active states use `duration-200 ease-out`.
- **Typing**: Every component has an exported `interface Props`.

Spec complete. Ready for implementation by @agents/frontend-developer.md using professional UI patterns

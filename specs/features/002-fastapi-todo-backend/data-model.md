# Data Model: Todo Application

## Entities

### Task
Represents an individual to-do item owned by a user.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | Integer | Primary Key | Auto-increment |
| user_id | String | Better Auth User ID | Required, Index |
| title | String | Task heading | Required, 1-200 chars |
| description| String | Optional details | Optional |
| completed | Boolean | Completion status | Default: False |
| created_at | DateTime | Creation timestamp | Auto-populate |
| updated_at | DateTime | Update timestamp | Auto-update |

## Relationships
- **User -> Task**: One-to-Many. One user (id from JWT) owns many tasks.

## Validation Rules
1. **Title Length**: 1 to 200 characters.
2. **User Isolation**: Every query (select, update, delete) MUST include `user_id == current_user_id`.

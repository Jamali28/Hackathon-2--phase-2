# REST API Specification

## Base URL
`https://<api-domain>/api`

## Authentication
All endpoints (except where noted) require a standard JWT Bearer token in the `Authorization` header.
`Authorization: Bearer <JWT>`

## Endpoints Table

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/tasks` | List all tasks for authenticated user | Yes |
| POST | `/tasks` | Create a new task | Yes |
| GET | `/tasks/{id}` | Get details of a specific task | Yes |
| PATCH | `/tasks/{id}` | Update task details or status | Yes |
| DELETE | `/tasks/{id}` | Delete a task | Yes |

## Endpoint Details

### 1. List Tasks
`GET /tasks`
- **Query Parameters**:
  - `status`: (Optional) `pending` \| `completed`
  - `sort`: (Optional) `created_at_asc` \| `created_at_desc` (Default: `created_at_desc`)
- **Response (200 OK)**:
```json
[
  {
    "id": "uuid",
    "title": "Buy groceries",
    "description": "Milk, eggs, and bread",
    "completed": false,
    "created_at": "ISO-Date"
  }
]
```

### 2. Create Task
`POST /tasks`
- **Request Body**:
```json
{
  "title": "New Task",
  "description": "Optional description"
}
```
- **Response (201 Created)**:
```json
{
  "id": "uuid",
  "title": "New Task",
  "description": "Optional description",
  "completed": false
}
```

### 3. Update Task
`PATCH /tasks/{id}`
- **Request Body**:
```json
{
  "title": "Updated Title",
  "completed": true
}
```
- **Response (200 OK)**:
```json
{
  "id": "uuid",
  "title": "Updated Title",
  "description": "Original description",
  "completed": true
}
```

### 4. Errors
- `401 Unauthorized`: Missing or invalid Bearer token.
- `404 Not Found`: Task does not exist or belongs to another user.
- `422 Unprocessable Entity`: Validation error (e.g., title too long).

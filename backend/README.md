# Todo SaaS Backend

This is the FastAPI backend for the Todo SaaS application. It provides a secure API for managing tasks with user authentication and authorization.

## Deployment on Hugging Face Spaces

This backend can be deployed on Hugging Face Spaces using Docker. The repository includes:

- `Dockerfile`: Defines the container image for the backend service
- `.dockerignore`: Specifies files to exclude from the Docker image
- `requirements.txt`: Python dependencies for the application

### Configuration

To deploy on Hugging Face Spaces, you'll need to set the following environment variables:

- `DATABASE_URL`: PostgreSQL database connection string
- `BETTER_AUTH_SECRET`: Secret key for authentication
- `PROXY_AUTH_TOKEN`: Token for proxy authentication between frontend and backend
- `CORS_ORIGINS`: Comma-separated list of allowed origins (optional)

### Quick Deploy

To deploy this backend on Hugging Face Spaces:

1. Fork this repository to your Hugging Face account
2. Create a new Space with Docker runtime
3. Point to your forked repository
4. Add the required environment variables in the Space settings

### API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task
- `PATCH /api/tasks/{id}/complete` - Toggle task completion status

### Architecture

The backend uses:
- FastAPI for the web framework
- SQLModel for database modeling
- PostgreSQL with psycopg2 for database connectivity
- JWT for authentication (when integrated with frontend)
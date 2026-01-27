# Quickstart: Full-Stack Integration

## Environment variables

### Backend (`backend/.env`)
```env
BETTER_AUTH_SECRET=V7l4KxuOQWBRJVyNDwizpFJlXhJ30bbE
DATABASE_URL=postgresql://neondb_owner:npg_aS3p9OywTzYG@ep-summer-cloud-a17attbe-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
CORS_ORIGINS=http://localhost:3000,https://hackathon-2-phase-2-seven.vercel.app
```

### Frontend (`frontend/.env`)
```env
NEXT_PUBLIC_API_URL=https://jamali28-todo-backend.hf.space/api
```

## Startup Instructions

1. **Backend**:
   ```bash
   cd backend
   pip install fastapi uvicorn sqlmodel psycopg[binary] PyJWT python-dotenv
   uvicorn main:app --reload --port 8000
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

## Integration Verification
1. Login via Frontend.
2. The `api-client.ts` will retrieve the `better-auth.session-token` from localStorage.
3. Backend will verify the token using the shared secret.
4. Tasks will be stored in Neon DB with user association.

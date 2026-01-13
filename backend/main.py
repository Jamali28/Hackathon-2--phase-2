import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from db import init_db
from routes import tasks

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB
    await init_db()
    yield
    # Shutdown: Clean up if needed

app = FastAPI(
    title="Todo SaaS API",
    description="A secure FastAPI backend for the Todo application",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
default_origins = ["http://localhost:3000", "http://localhost:3001", "https://localhost:3000", "https://localhost:3001"]
additional_origins = os.getenv("CORS_ORIGINS", "").split(",")
all_origins = default_origins + [origin for origin in additional_origins if origin.strip()]

# Remove duplicates while preserving order
origins = list(dict.fromkeys(all_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(tasks.router, prefix="/api", tags=["Tasks"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

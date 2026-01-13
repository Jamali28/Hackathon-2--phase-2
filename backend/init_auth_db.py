import os
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

async def create_auth_tables():
    engine = create_async_engine(DATABASE_URL, echo=True)

    auth_schema = """
    CREATE TABLE IF NOT EXISTS "user" (
        id text NOT NULL PRIMARY KEY,
        name text NOT NULL,
        email text NOT NULL,
        "emailVerified" boolean NOT NULL,
        image text,
        "createdAt" timestamp without time zone NOT NULL,
        "updatedAt" timestamp without time zone NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "session" (
        id text NOT NULL PRIMARY KEY,
        "expiresAt" timestamp without time zone NOT NULL,
        "token" text NOT NULL UNIQUE,
        "createdAt" timestamp without time zone NOT NULL,
        "updatedAt" timestamp without time zone NOT NULL,
        "ipAddress" text,
        "userAgent" text,
        "userId" text NOT NULL REFERENCES "user"(id)
    );

    CREATE TABLE IF NOT EXISTS "account" (
        id text NOT NULL PRIMARY KEY,
        "accountId" text NOT NULL,
        "providerId" text NOT NULL,
        "userId" text NOT NULL REFERENCES "user"(id),
        "accessToken" text,
        "refreshToken" text,
        "idToken" text,
        "accessTokenExpiresAt" timestamp without time zone,
        "refreshTokenExpiresAt" timestamp without time zone,
        "scope" text,
        "password" text,
        "createdAt" timestamp without time zone NOT NULL,
        "updatedAt" timestamp without time zone NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "verification" (
        id text NOT NULL PRIMARY KEY,
        identifier text NOT NULL,
        value text NOT NULL,
        "expiresAt" timestamp without time zone NOT NULL,
        "createdAt" timestamp without time zone,
        "updatedAt" timestamp without time zone
    );
    """

    async with engine.begin() as conn:
        await conn.execute(text(auth_schema))
        print("Better Auth tables created successfully.")

if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(create_auth_tables())

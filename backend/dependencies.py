import os
import jwt
import base64
from fastapi import Depends, HTTPException, status, Request
from dotenv import load_dotenv

load_dotenv()

BETTER_AUTH_SECRET = os.getenv("BETTER_AUTH_SECRET")

async def get_current_user(request: Request) -> str:
    # First, try to get the token from the Authorization header
    auth_header = request.headers.get("Authorization")

    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header[len("Bearer "):]
    else:
        # If no Authorization header, try to get token from cookies (Better Auth session cookie)
        # Better Auth typically stores session tokens in cookies
        possible_cookies = [
            "better-auth.session_token",
            "__Secure-better-auth.session_token",
            "better-auth-session"
        ]

        token = None
        for cookie_name in possible_cookies:
            cookie_value = request.cookies.get(cookie_name)
            if cookie_value:
                token = cookie_value
                break

        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No authentication token provided in headers or cookies. " +
                       f"Headers: {list(request.headers.keys())}, " +
                       f"Cookies: {list(request.cookies.keys())}"
            )

    try:
        # Decode the JWT token with the secret
        payload = jwt.decode(
            token,
            BETTER_AUTH_SECRET,
            algorithms=["HS256"]
        )

        # Extract user ID from the payload
        user_id: str = payload.get("sub")

        # If 'sub' is not available, try other possible claims
        if not user_id:
            user_id = payload.get("userId") or payload.get("user_id") or payload.get("id")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid authentication credentials - no user ID found in token. Available claims: {list(payload.keys())}",
            )

        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.InvalidSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token signature. Make sure the BETTER_AUTH_SECRET matches between frontend and backend.",
        )
    except jwt.DecodeError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not decode token - invalid JWT format. Received token length: " + str(len(token)) + ", starts with: " + token[:20],
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {str(e)}",
        )

import os
from fastapi import Depends, HTTPException, status, Request
from dotenv import load_dotenv
import httpx

load_dotenv()

BETTER_AUTH_URL = os.getenv("BETTER_AUTH_URL", "http://localhost:3000")
BETTER_AUTH_SECRET = os.getenv("BETTER_AUTH_SECRET")

async def get_current_user(request: Request) -> str:
    # First, check if the frontend proxy sent the user ID in the X-User-ID header
    # This is the preferred approach when using the Next.js API route as a proxy
    user_id = request.headers.get("x-user-id")

    if user_id:
        # If user ID is provided by the proxy, verify the proxy token for security
        proxy_token = request.headers.get("x-proxy-token")
        expected_proxy_token = os.getenv("PROXY_AUTH_TOKEN")

        if expected_proxy_token and proxy_token != expected_proxy_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid proxy authentication token"
            )

        return user_id

    # If no user ID was provided by the proxy, try to validate the session using cookies
    # Get the session token from cookies (Better Auth session cookie)
    session_token = None

    # Try to get the session token from various possible cookie names
    possible_cookie_names = [
        "better-auth.session_token",
        "__Secure-better-auth.session_token",
        "better-auth-session",
        "session_token"
    ]

    for cookie_name in possible_cookie_names:
        if cookie_name in request.cookies:
            session_token = request.cookies[cookie_name]
            break

    # If no session token found in cookies, try to get from Authorization header
    if not session_token:
        auth_header = request.headers.get("authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header[7:]  # Remove "Bearer " prefix

    if not session_token:
        # Debug: print available cookies and headers for troubleshooting
        available_cookies = list(request.cookies.keys())
        available_headers = list(request.headers.keys())
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"No session token found. Available cookies: {available_cookies}. Available headers: {available_headers}. Please log in first."
        )

    # For now, return a placeholder user ID - in a real implementation,
    # you would validate the Better Auth session properly via the Better Auth API
    # This fallback is for when the proxy doesn't send the user ID but cookies are present
    return "authenticated_user"

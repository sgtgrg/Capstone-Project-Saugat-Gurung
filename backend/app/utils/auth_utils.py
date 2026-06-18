"""Authentication helpers: password hashing, JWT tokens, and a decorator
that protects routes by requiring a valid token.
"""
from datetime import datetime, timedelta, timezone
from functools import wraps

import bcrypt
import jwt
from bson import ObjectId
from flask import request, jsonify, g

from config import Config
from app.models.user import find_user_by_id


# --- Passwords --------------------------------------------------------------
def hash_password(plain: str) -> str:
    """Return a bcrypt hash (stored as a string) for a plain-text password."""
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    """Check a plain-text password against a stored bcrypt hash."""
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except (ValueError, TypeError):
        return False


# --- JWT tokens -------------------------------------------------------------
def create_token(user_id) -> str:
    """Create a signed JWT containing the user id and an expiry."""
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": now + timedelta(hours=Config.JWT_EXPIRES_HOURS),
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")


def decode_token(token: str):
    """Decode a JWT. Returns the payload dict, or None if invalid/expired."""
    try:
        return jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
    except jwt.PyJWTError:
        return None


# --- Route protection -------------------------------------------------------
def token_required(f):
    """Decorator: rejects the request unless a valid Bearer token is present.

    On success, the authenticated user document is attached to flask.g.user.
    """
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Authorization token missing"}), 401

        token = auth_header.split(" ", 1)[1].strip()
        payload = decode_token(token)
        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401

        user = find_user_by_id(payload.get("sub"))
        if not user:
            return jsonify({"error": "User no longer exists"}), 401

        g.user = user
        return f(*args, **kwargs)

    return wrapper

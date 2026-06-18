"""Authentication routes: register, login, and current-user (me).

Built on Day 1/2. Passwords are hashed with bcrypt; sessions use JWT.
"""
import re

from flask import Blueprint, request, jsonify, g
from pymongo.errors import DuplicateKeyError

from app.models.user import (
    create_user,
    find_user_by_email,
    public_user,
    ensure_indexes,
)
from app.utils.auth_utils import (
    hash_password,
    verify_password,
    create_token,
    token_required,
)

auth_bp = Blueprint("auth", __name__)

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _validate_register(data):
    """Return an error string if the registration payload is invalid, else None."""
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    password = data.get("password") or ""

    if not name:
        return "Name is required"
    if not EMAIL_RE.match(email):
        return "A valid email is required"
    if len(password) < 8:
        return "Password must be at least 8 characters"
    return None


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}

    error = _validate_register(data)
    if error:
        return jsonify({"error": error}), 400

    # Make sure the unique-email index exists before inserting.
    ensure_indexes()

    if find_user_by_email(data["email"]):
        return jsonify({"error": "An account with this email already exists"}), 409

    try:
        user = create_user(
            name=data["name"],
            email=data["email"],
            password_hash=hash_password(data["password"]),
        )
    except DuplicateKeyError:
        return jsonify({"error": "An account with this email already exists"}), 409

    token = create_token(user["_id"])
    return jsonify({"token": token, "user": public_user(user)}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = find_user_by_email(email)
    # Same generic message whether the email or password is wrong (don't leak).
    if not user or not verify_password(password, user.get("password", "")):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_token(user["_id"])
    return jsonify({"token": token, "user": public_user(user)}), 200


@auth_bp.get("/me")
@token_required
def me():
    """Return the currently-authenticated user (used to restore sessions)."""
    return jsonify({"user": public_user(g.user)}), 200

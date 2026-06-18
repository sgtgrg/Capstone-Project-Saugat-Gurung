"""User model: thin helpers around the MongoDB `users` collection.

A user document looks like:
{
    _id: ObjectId,
    name: str,
    email: str (unique, lowercase),
    password: str (bcrypt hash),
    created_at: datetime
}
"""
from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId

from app.extensions import get_db


def _collection():
    return get_db()["users"]


def ensure_indexes():
    """Create a unique index on email so duplicates are impossible."""
    _collection().create_index("email", unique=True)


def find_user_by_email(email: str):
    if not email:
        return None
    return _collection().find_one({"email": email.lower().strip()})


def find_user_by_id(user_id):
    """Look up a user by their string/ObjectId id. Returns None if not found."""
    try:
        oid = ObjectId(str(user_id))
    except (InvalidId, TypeError):
        return None
    return _collection().find_one({"_id": oid})


def create_user(name: str, email: str, password_hash: str):
    """Insert a new user and return the created document."""
    doc = {
        "name": name.strip(),
        "email": email.lower().strip(),
        "password": password_hash,
        "created_at": datetime.now(timezone.utc),
    }
    result = _collection().insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc


def public_user(user: dict) -> dict:
    """Return a user dict safe to send to the client (no password, id as str)."""
    if not user:
        return {}
    return {
        "id": str(user["_id"]),
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "created_at": user.get("created_at").isoformat()
        if user.get("created_at")
        else None,
    }

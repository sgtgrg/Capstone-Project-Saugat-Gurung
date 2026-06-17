"""Health-check endpoint. Used by the frontend to confirm the API + DB are up."""
from datetime import datetime, timezone
from flask import Blueprint, jsonify

from app.extensions import get_db

health_bp = Blueprint("health", __name__)


@health_bp.get("/health")
def health():
    db_ok = False
    try:
        # The ismaster/ping command is cheap and confirms the connection works.
        get_db().command("ping")
        db_ok = True
    except Exception:
        db_ok = False

    return jsonify({
        "status": "ok",
        "service": "cognitive-stress-tracker-api",
        "database": "connected" if db_ok else "unavailable",
        "time": datetime.now(timezone.utc).isoformat(),
    })

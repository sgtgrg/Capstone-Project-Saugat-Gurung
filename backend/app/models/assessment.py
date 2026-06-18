"""Assessment model: self-assessment documents (PSS-10 + daily factors).

A document looks like:
{
    _id, user_id: ObjectId, created_at: datetime,
    pss10: { responses: [10 ints 0-4], score: int 0-40, category: str },
    factors: { sleep: 1-10, workload: 1-10, focus: 1-10, mood: 1-10 }
}
"""
from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId

from app.extensions import get_db

# PSS-10 items 4, 5, 7, 8 are positively worded and must be reverse-scored.
# (1-based item numbers -> 0-based indexes 3, 4, 6, 7.)
REVERSE_INDEXES = {3, 4, 6, 7}

FACTOR_KEYS = ("sleep", "workload", "focus", "mood")


def _collection():
    return get_db()["assessments"]


def score_pss10(responses):
    """Compute the PSS-10 total (0-40) from ten 0-4 responses.

    Returns (score, category). Raises ValueError if the input is invalid.
    """
    if not isinstance(responses, list) or len(responses) != 10:
        raise ValueError("PSS-10 requires exactly 10 responses")

    total = 0
    for i, raw in enumerate(responses):
        if not isinstance(raw, int) or raw < 0 or raw > 4:
            raise ValueError("Each PSS-10 response must be an integer from 0 to 4")
        total += (4 - raw) if i in REVERSE_INDEXES else raw

    return total, categorize_pss10(total)


def categorize_pss10(score):
    """Standard PSS-10 bands (Cohen, 1983)."""
    if score <= 13:
        return "low"
    if score <= 26:
        return "moderate"
    return "high"


def validate_factors(factors):
    """Ensure all four 1-10 factor scores are present and valid.

    Returns a clean dict. Raises ValueError on bad input.
    """
    if not isinstance(factors, dict):
        raise ValueError("factors must be an object")

    clean = {}
    for key in FACTOR_KEYS:
        val = factors.get(key)
        if not isinstance(val, int) or val < 1 or val > 10:
            raise ValueError(f"'{key}' must be an integer from 1 to 10")
        clean[key] = val
    return clean


def create_assessment(user_id, responses, factors):
    """Validate, score, and insert an assessment. Returns the saved document."""
    score, category = score_pss10(responses)
    clean_factors = validate_factors(factors)

    doc = {
        "user_id": ObjectId(str(user_id)),
        "created_at": datetime.now(timezone.utc),
        "pss10": {
            "responses": responses,
            "score": score,
            "category": category,
        },
        "factors": clean_factors,
    }
    result = _collection().insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc


def list_assessments(user_id, limit=100):
    """Return a user's assessments, newest first."""
    try:
        uid = ObjectId(str(user_id))
    except (InvalidId, TypeError):
        return []
    cursor = (
        _collection()
        .find({"user_id": uid})
        .sort("created_at", -1)
        .limit(limit)
    )
    return [public_assessment(doc) for doc in cursor]


def assessment_stats(user_id):
    """Lightweight baseline stats over a user's history (used for insights)."""
    items = list_assessments(user_id, limit=1000)
    count = len(items)
    if count == 0:
        return {"count": 0, "average_score": None, "average_factors": None}

    avg_score = round(sum(a["pss10"]["score"] for a in items) / count, 1)
    avg_factors = {}
    for key in FACTOR_KEYS:
        avg_factors[key] = round(sum(a["factors"][key] for a in items) / count, 1)

    return {"count": count, "average_score": avg_score, "average_factors": avg_factors}


def public_assessment(doc):
    """Serialise an assessment for the client (ids as strings, ISO dates)."""
    if not doc:
        return {}
    return {
        "id": str(doc["_id"]),
        "created_at": doc["created_at"].isoformat() if doc.get("created_at") else None,
        "pss10": doc.get("pss10", {}),
        "factors": doc.get("factors", {}),
    }

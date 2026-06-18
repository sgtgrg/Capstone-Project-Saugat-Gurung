"""Self-assessment routes (PSS-10 + daily factors).

All routes require a logged-in user (token). On create, we score the PSS-10,
save the assessment, and return rule-based suggestions immediately.
"""
from flask import Blueprint, request, jsonify, g

from app.models.assessment import (
    create_assessment as create_assessment_doc,
    list_assessments,
    assessment_stats,
    public_assessment,
)
from app.utils.auth_utils import token_required
from app.utils.suggestions import suggest_for_assessment, suggest_for_trend

assessments_bp = Blueprint("assessments", __name__)


@assessments_bp.post("")
@token_required
def create_assessment():
    data = request.get_json(silent=True) or {}
    responses = data.get("responses")
    factors = data.get("factors")

    try:
        doc = create_assessment_doc(g.user["_id"], responses, factors)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    pub = public_assessment(doc)
    suggestions = suggest_for_assessment(pub["pss10"]["category"], pub["factors"])

    return jsonify({"assessment": pub, "suggestions": suggestions}), 201


@assessments_bp.get("")
@token_required
def get_assessments():
    items = list_assessments(g.user["_id"])
    return jsonify({"assessments": items}), 200


@assessments_bp.get("/stats")
@token_required
def get_stats():
    """Baseline averages + trend-based suggestions (used by the dashboard)."""
    stats = assessment_stats(g.user["_id"])
    suggestions = suggest_for_trend(stats)
    return jsonify({"stats": stats, "suggestions": suggestions}), 200

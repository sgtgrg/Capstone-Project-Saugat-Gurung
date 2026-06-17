"""Self-assessment routes (PSS-10 + custom 1-10 questions).

Scaffold only — full logic is built on Days 2-3 (Jun 18-19) of the plan.
"""
from flask import Blueprint, jsonify

assessments_bp = Blueprint("assessments", __name__)


@assessments_bp.post("")
def create_assessment():
    return jsonify({"message": "create assessment - to be implemented Day 2"}), 501


@assessments_bp.get("")
def list_assessments():
    return jsonify({"message": "list assessments - to be implemented Day 2"}), 501

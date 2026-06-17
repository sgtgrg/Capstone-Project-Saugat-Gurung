"""Physiological (rPPG) routes.

Only aggregated heart-rate / HRV metrics are sent here — never raw video.
Scaffold only — full logic is built on Day 7 (Jun 27) of the plan.
"""
from flask import Blueprint, jsonify

physiological_bp = Blueprint("physiological", __name__)


@physiological_bp.post("")
def save_session():
    return jsonify({"message": "save rPPG metrics - to be implemented Day 7"}), 501


@physiological_bp.get("")
def list_sessions():
    return jsonify({"message": "list rPPG sessions - to be implemented Day 7"}), 501

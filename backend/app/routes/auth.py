"""Authentication routes (register / login).

Scaffold only — full logic is built on Day 1 (Jun 16) of the plan.
The endpoints exist so the API structure is complete and importable today.
"""
from flask import Blueprint, jsonify

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    return jsonify({"message": "register endpoint - to be implemented Day 1"}), 501


@auth_bp.post("/login")
def login():
    return jsonify({"message": "login endpoint - to be implemented Day 1"}), 501

"""Flask application factory.

Using a factory (create_app) keeps configuration in one place and makes the
app easy to test. Routes are organised into Blueprints (auth, assessments,
physiological) exactly as described in the project proposal.
"""
from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from app.extensions import init_db


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Allow the React dev server to call this API from a different origin.
    CORS(app, resources={r"/api/*": {"origins": [Config.FRONTEND_ORIGIN]}},
         supports_credentials=True)

    # Connect to MongoDB (won't crash startup if DB is momentarily down).
    try:
        init_db()
    except Exception as exc:  # pragma: no cover
        app.logger.warning("MongoDB not reachable yet: %s", exc)

    # --- Register blueprints -------------------------------------------------
    from app.routes.health import health_bp
    from app.routes.auth import auth_bp
    from app.routes.assessments import assessments_bp
    from app.routes.physiological import physiological_bp

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(assessments_bp, url_prefix="/api/assessments")
    app.register_blueprint(physiological_bp, url_prefix="/api/physiological")

    # --- Friendly JSON errors ------------------------------------------------
    @app.errorhandler(404)
    def not_found(_):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def server_error(_):
        return jsonify({"error": "Internal server error"}), 500

    return app

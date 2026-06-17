"""Central configuration. Values are read from environment variables (.env)."""
import os
from dotenv import load_dotenv

# Load variables from a .env file sitting next to this file (if present).
load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")

    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "stress_tracker")

    JWT_SECRET = os.getenv("JWT_SECRET", "dev-jwt-secret-change-me")
    JWT_EXPIRES_HOURS = int(os.getenv("JWT_EXPIRES_HOURS", "24"))

    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

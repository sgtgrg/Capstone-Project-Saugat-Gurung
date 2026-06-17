"""Database connection helper.

We keep a single MongoClient for the whole app. Other modules import
`get_db()` to grab the database handle.
"""
from pymongo import MongoClient
from config import Config

_client = None
_db = None


def init_db():
    """Create the Mongo client + database handle. Called once at startup."""
    global _client, _db
    if _client is None:
        _client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=5000)
        _db = _client[Config.MONGO_DB_NAME]
    return _db


def get_db():
    """Return the active database handle (initialising it if needed)."""
    if _db is None:
        return init_db()
    return _db

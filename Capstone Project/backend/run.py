"""Entry point. Run with:  python run.py"""
from app import create_app

app = create_app()

if __name__ == "__main__":
    # debug=True gives auto-reload + helpful error pages during development.
    app.run(host="0.0.0.0", port=5000, debug=True)

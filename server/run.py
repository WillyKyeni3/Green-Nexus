# server/run.py
import os
from dotenv import load_dotenv
from app import create_app, db  # ← Import db for table creation

load_dotenv()

# === CONFIG ===
# Use FLASK_CONFIG if set, fallback to 'production' in Render
config_name = os.getenv('FLASK_CONFIG', 'production')
app = create_app(config_name=config_name)

# === CREATE DATABASE TABLES ON STARTUP (SAFE FOR GUNICORN) ===
with app.app_context():
    db.create_all()
    print("Database tables ensured (created if not exists)")

# === LOCAL DEV ONLY ===
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = config_name != 'production'  # Only debug in development
    app.run(host='0.0.0.0', port=port, debug=debug)

import os
from dotenv import load_dotenv
from app import create_app, db

load_dotenv()

# === CREATE APP (Gunicorn imports: run:app) ===
app = create_app(os.getenv('FLASK_CONFIG', 'production'))

# === CREATE TABLES ONLY IF DB URL IS VALID (PREVENTS CRASH ON RENDER) ===
with app.app_context():
    db_url = app.config.get('SQLALCHEMY_DATABASE_URI', '')
    if db_url and (db_url.startswith('sqlite://') or 'postgres' in db_url):
        try:
            db.create_all()
            print("Database tables created (if not exists)")
        except Exception as e:
            print(f"DB creation failed (Render cold start): {e}")
    else:
        print("No valid DATABASE_URL — skipping table creation")

# === LOCAL DEV ONLY ===
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.getenv('FLASK_CONFIG') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug)

import os
from dotenv import load_dotenv
from app import create_app

load_dotenv()

# === CREATE APP (Gunicorn imports: run:app) ===
app = create_app(os.getenv('FLASK_CONFIG', 'production'))

# === LOCAL DEV ONLY ===
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.getenv('FLASK_CONFIG') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug)

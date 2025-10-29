# server/app/__init__.py
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# ----------------------------------------------------------------------
# Extensions (global)
# ----------------------------------------------------------------------
db = SQLAlchemy()
jwt = JWTManager()


# ----------------------------------------------------------------------
# IMPORT MODELS (so SQLAlchemy registers tables)
# ----------------------------------------------------------------------
from app.models.user import User          # <-- add every model here
from app.models.activity import Activity
from config import Config
# from app.models.waste_item import WasteItem   # uncomment when ready
# from app.models.product import Product


def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(Config)

    # -------------------------- CONFIG --------------------------
    class BaseConfig:
        SECRET_KEY = os.getenv('SECRET_KEY') or 'dev-secret-change-me'
        JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY') or 'dev-jwt-change-me'

        # Render gives postgres:// → convert to postgresql://
        db_url = os.getenv('DATABASE_URL')
        if db_url and db_url.startswith('postgres://'):
            db_url = db_url.replace('postgres://', 'postgresql://', 1)
        SQLALCHEMY_DATABASE_URI = db_url or 'sqlite:///instance/greennexus.db'

        SQLALCHEMY_TRACK_MODIFICATIONS = False
        UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'uploads')
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    app.config.from_object(BaseConfig)

    # -------------------------- EXTENSIONS --------------------------
    db.init_app(app)
    jwt.init_app(app)

    # -------------------------- CORS --------------------------
    CORS(
        app,
        resources={r"/api/*": {
            "origins": [
                "http://localhost:3000",
                "http://localhost:3001",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:3001",
                # <-- add your Vercel domain later
                # "https://your-frontend.vercel.app"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
            "max_age": 3600
        }}
    )

    # -------------------------- BLUEPRINTS --------------------------
    print("\nRegistering API Blueprints...")

    def _register(bp, prefix, name):
        try:
            app.register_blueprint(bp, url_prefix=prefix)
            print(f"{name} API → {prefix}/*")
        except Exception as e:
            print(f"{name} blueprint missing: {e}")

    # Auth
    from app.routes.auth import auth_bp
    _register(auth_bp, '/api/auth', 'Auth')

    # Activities
    from app.routes.activities import activities_bp
    _register(activities_bp, '/api/activities', 'Activities')

    # Waste Scanner
    try:
        from app.routes.waste_scanner import waste_scanner_bp
        _register(waste_scanner_bp, '/api/waste-scanner', 'Waste Scanner')
    except ImportError:
        print("Waste Scanner blueprint not configured yet")

    # Marketplace
    try:
        from app.routes.marketplace import marketplace_bp
        app.register_blueprint(marketplace_bp)   # uses its own prefixes
        print("Marketplace API registered")
    except ImportError as e:
        print(f"Marketplace blueprint missing: {e}")

    print("Blueprint registration complete!\n")

    # -------------------------- ROOT ROUTE --------------------------
    @app.route('/')
    def welcome():
        return {
            "message": "Welcome to Green-Nexus Backend!",
            "version": "1.0.0",
            "endpoints": {
                "Auth": "/api/auth/*",
                "Activities": "/api/activities/*",
                "Waste Scanner": "/api/waste-scanner/*",
                "Marketplace": "/api/chat"
            }
        }, 200

    # Create tables on first request (Render cold start)
    @app.before_first_request
    def create_tables():
        db.create_all()

    return app

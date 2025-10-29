import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

# ----------------------------------------------------------------------
# Extensions (global)
# ----------------------------------------------------------------------
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()  # ✅ define migrate globally for flask db commands

# ----------------------------------------------------------------------
# Import models (SQLAlchemy must see them)
# ----------------------------------------------------------------------
from app.models.user import User
from app.models.activity import Activity
# from app.models.waste_item import WasteItem
# from app.models.product import Product


def create_app(config_name='development'):
    app = Flask(__name__)

    # -------------------------- CONFIG --------------------------
    try:
        from config import Config
        app.config.from_object(Config)
    except ImportError:
        print("config.py not found! Using fallback.")

        class FallbackConfig:
            SECRET_KEY = os.getenv('SECRET_KEY') or 'fallback-secret'
            JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY') or 'fallback-jwt'
            SQLALCHEMY_TRACK_MODIFICATIONS = False
            db_url = os.getenv('DATABASE_URL')
            if db_url:
                if db_url.startswith('postgres://'):
                    db_url = db_url.replace('postgres://', 'postgresql://', 1)
            else:
                if os.getenv('RENDER'):
                    raise RuntimeError(
                        "DATABASE_URL environment variable is not set on Render. "
                        "Please add a PostgreSQL database to your Render service."
                    )
                db_url = 'sqlite:///instance/greennexus.db'
            SQLALCHEMY_DATABASE_URI = db_url
            UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        app.config.from_object(FallbackConfig)

    # -------------------------- EXTENSIONS --------------------------
    db.init_app(app)
    migrate.init_app(app, db)  # ✅ initialize globally defined migrate here
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
                "https://*.vercel.app",
                "*"
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
            print(f"{name} API → {prefix}")
        except Exception as e:
            print(f"{name} failed: {e}")

    # Auth
    try:
        from app.routes.auth import auth_bp
        _register(auth_bp, '/api/auth', 'Auth')
    except ImportError as e:
        print(f"Auth import failed: {e}")

    # Activities
    try:
        from app.routes.activities import activities_bp
        _register(activities_bp, '/api/activities', 'Activities')
    except ImportError as e:
        print(f"Activities import failed: {e}")

    # Waste Scanner
    try:
        from app.routes.waste_scanner import waste_scanner_bp
        _register(waste_scanner_bp, '/api/waste-scanner', 'Waste Scanner')
    except ImportError:
        print("Waste Scanner not configured")

    # Marketplace
    try:
        from app.routes.marketplace import marketplace_bp
        app.register_blueprint(marketplace_bp)
        print("Marketplace API registered")
    except ImportError as e:
        print(f"Marketplace missing: {e}")

    print("Blueprint registration complete!\n")

    # -------------------------- ERROR HANDLERS --------------------------
    @app.errorhandler(400)
    def bad_request(error):
        return {"error": "Bad request", "message": str(error)}, 400

    @app.errorhandler(401)
    def unauthorized(error):
        return {"error": "Unauthorized", "message": str(error)}, 401

    @app.errorhandler(403)
    def forbidden(error):
        return {"error": "Forbidden", "message": str(error)}, 403

    @app.errorhandler(404)
    def not_found(error):
        return {"error": "Not found", "message": str(error)}, 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return {"error": "Method not allowed", "message": str(error)}, 405

    @app.errorhandler(500)
    def internal_server_error(error):
        app.logger.error(f"Internal server error: {str(error)}")
        return {"error": "Internal server error", "message": "An unexpected error occurred. Please try again later."}, 500

    @app.errorhandler(Exception)
    def handle_exception(error):
        app.logger.error(f"Unhandled exception: {str(error)}", exc_info=True)
        return {"error": "Internal server error", "message": "An unexpected error occurred. Please try again later."}, 500

    # -------------------------- ROOT ROUTE --------------------------
    @app.route('/')
    def welcome():
        return {"message": "Green-Nexus Backend Live"}

    return app

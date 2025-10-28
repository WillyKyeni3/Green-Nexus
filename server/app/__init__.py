# server/app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_name='development'):
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)

    # Enable CORS for frontend
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:3000",
                "http://127.0.0.1:3000"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    print("\nRegistering API Blueprints...")

    # Register blueprints
    try:
        from app.routes.activities import activities_bp
        app.register_blueprint(activities_bp, url_prefix='/api/activities')
        print("Activities API → /api/activities/*")
    except ImportError as e:
        print(f"Activities blueprint missing: {e}")

    try:
        from app.routes.auth import auth_bp
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        print("Auth API → /api/auth/*")
    except ImportError:
        print("Auth blueprint not configured")

    try:
        from app.routes.marketplace import marketplace_bp
        app.register_blueprint(marketplace_bp)
        print("Marketplace API registered")
    except ImportError:
        print("Marketplace blueprint missing")

    try:
        from app.routes.waste_scanner import waste_scanner_bp
        app.register_blueprint(waste_scanner_bp, url_prefix='/api/waste-scanner')
        print("Waste Scanner API → /api/waste-scanner/*")
    except ImportError:
        print("Waste Scanner blueprint missing")

    print("Blueprint registration complete!\n")

    # Root welcome endpoint
    @app.route('/')
    def welcome():
        return {
            "message": "Welcome to Green-Nexus Backend!",
            "version": "1.0.0",
            "endpoints": {
                "Activities": "/api/activities/*",
                "Auth": "/api/auth/*",
                "Waste Scanner": "/api/waste-scanner/*"
            }
        }, 200

    return app
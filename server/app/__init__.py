# server/app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flasgger import Swagger  # ← ADD THIS
from config import Config

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()

# IMPORT ALL MODELS HERE to ensure SQLAlchemy knows about them
from app.models.user import User 

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
                "http://localhost:3001",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:3001"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
            "max_age": 3600
        }
    })

    # ← ADD SWAGGER CONFIGURATION HERE
    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": 'apispec',
                "route": '/apispec.json',
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/apidocs/"
    }
    
    swagger_template = {
        "info": {
            "title": "GreenNexus API",
            "description": "API documentation for GreenNexus Backend - Environmental tracking and waste management platform",
            "version": "1.0.0",
            "contact": {
                "name": "GreenNexus Team",
                "email": "support@greennexus.com"
            }
        },
        "securityDefinitions": {
            "Bearer": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header",
                "description": "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'"
            }
        },
        "security": [{"Bearer": []}]
    }
    
    Swagger(app, config=swagger_config, template=swagger_template)
    print("✅ Swagger documentation enabled at /apidocs/")
    # ← END SWAGGER CONFIGURATION

    print("\n🚀 Registering API Blueprints...")
    
    # Register blueprints (routes)
    try:
        from app.routes.auth import auth_bp
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        print("✅ Auth API registered at /api/auth")
    except ImportError:
        print("⚠️  Auth blueprint not configured yet")
    
    try:
        from app.routes.activities import activities_bp
        app.register_blueprint(activities_bp, url_prefix='/api/activities')
        print("✅ Activities API registered at /api/activities")
    except ImportError:
        print("⚠️  Activities blueprint not configured yet")
    
    try:
        from app.routes.waste_scanner import waste_scanner_bp
        app.register_blueprint(waste_scanner_bp, url_prefix='/api/waste-scanner')
        print("✅ Waste Scanner API registered at /api/waste-scanner")
    except ImportError:
        print("⚠️  Waste Scanner blueprint not configured yet")

    try:
        from app.routes.marketplace import marketplace_bp
        app.register_blueprint(marketplace_bp)
        print("✅ Marketplace API registered at /api/chat")
    except ImportError as e:
        print(f"⚠️  Marketplace blueprint not found: {e}")

    print("✨ Blueprint registration complete!\n")

    @app.route('/')
    def welcome():
        return {
            "message": "Welcome to Green-Nexus Backend!",
            "version": "1.0.0",
            "documentation": "/apidocs/",  # ← ADD THIS
            "endpoints": {
                "Activities": "/api/activities/*",
                "Auth": "/api/auth/*",
                "Waste Scanner": "/api/waste-scanner/*",
                "Marketplace Chat": "/api/chat"
            }
        }, 200

    return app
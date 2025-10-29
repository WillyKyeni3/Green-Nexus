# server/app/__init__.py
import os # Import os module
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate # Import Migrate
from config import Config # Assuming you will create this file for configuration

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate() # Initialize Migrate

# IMPORT ALL MODELS HERE to ensure SQLAlchemy knows about them
# This is crucial for Flask-Migrate to detect them.
from app.models.user import User
# Import other models from the models directory
from app.models.activity import Activity # Assuming your Activity model is here
from app.models.waste_item import WasteItem # Assuming your WasteItem model is here
# Add other models if you have them, e.g.:
# from app.models.product import Product # If you have a Product model


def create_app(config_name='development'):
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(Config)

    # --- DATABASE URI CONFIGURATION (Dynamic based on DATABASE_URL) ---
    # Check for DATABASE_URL environment variable (e.g., from Render)
    database_url = os.getenv('DATABASE_URL')

    if database_url:
        # Use DATABASE_URL if available (e.g., on Render)
        # SQLAlchemy needs 'postgresql://' instead of 'postgres://'
        if database_url.startswith("postgres://"):
            database_url = database_url.replace("postgres://", "postgresql://", 1)
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
        print(f"Using DATABASE_URL: {database_url}") # Optional: Print for confirmation
    else:
        # Fallback to local SQLite for development if DATABASE_URL is not set
        # Adjust the path as needed, e.g., 'sqlite:///../greennexus.db'
        local_db_path = os.getenv('LOCAL_DB_PATH', 'greennexus.db') # Use env var or default
        app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{local_db_path}'
        print(f"Using local SQLite: {local_db_path}") # Optional: Print for confirmation

    # Initialize extensions (db must be initialized after URI is set)
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db) # Initialize Migrate with the app and db instance

    # Enable CORS for frontend - combined configuration
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

    # Marketplace blueprint - UNCOMMENTED to enable the chat API
    try:
        from app.routes.marketplace import marketplace_bp
        app.register_blueprint(marketplace_bp) # This registers routes under /api/... as defined in the blueprint
        print("✅ Marketplace API registered at /api/chat")
    except ImportError as e:
        print(f"⚠️  Marketplace blueprint not found: {e}")

    print("✨ Blueprint registration complete!\n")

    # Combined welcome route with both versions' information
    @app.route('/')
    def welcome():
        return {
            "message": "Welcome to Green-Nexus Backend!",
            "version": "1.0.0",
            "endpoints": {
                "Activities": "/api/activities/*",
                "Auth": "/api/auth/*",
                "Waste Scanner": "/api/waste-scanner/*",
                "Marketplace Chat": "/api/chat" # Add this to the welcome message
            }
        }, 200

    return app
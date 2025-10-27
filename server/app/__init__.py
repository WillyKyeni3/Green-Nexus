# server/app/__init__.py
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from config import Config # Assuming you will create this file for configuration


# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_name='development'): # You can add different config names later
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(Config)

    # Initialize extensions with the app instance
    db.init_app(app)
    jwt.init_app(app)
    
    # Enable CORS for all routes with specific configuration
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
    # Commenting out marketplace for now to avoid OpenAI API key error during db init
    # try:
    #     from app.routes.marketplace import marketplace_bp
    #     app.register_blueprint(marketplace_bp)
    #     print("✅ Marketplace API registered at /api/chat")
    # except ImportError as e:
    #     print(f"⚠️  Marketplace blueprint not found: {e}")
    
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
    
    print("✨ Blueprint registration complete!\n")


    # Import and register blueprints here after creating them
    # The direct import for auth_bp (without try-catch) is now redundant
    # since it's handled in the try-catch block above. We can remove this line.
    # from app.routes.auth import auth_bp
    # app.register_blueprint(auth_bp) # Register the auth blueprint

    # Placeholder welcome route
    @app.route('/')
    def home():
        return {"message": "Welcome to the Green-Nexus API!"}, 200

    return app
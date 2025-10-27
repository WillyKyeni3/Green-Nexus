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

    # Create database tables
    with app.app_context():
        try:
            db.create_all()
            print("✅ Database tables initialized")
        except Exception as e:
            print(f"⚠️  Database initialization error: {e}")

    print("\n🚀 Registering API Blueprints...")
    
    # Register blueprints (routes)
    try:
        from app.routes.marketplace import marketplace_bp
        app.register_blueprint(marketplace_bp)
        print("✅ Marketplace API registered at /api/chat")
    except ImportError as e:
        print(f"⚠️  Marketplace blueprint not found: {e}")
    except Exception as e:
        print(f"❌ Error registering Marketplace blueprint: {e}")
    
    try:
        from app.routes.auth import auth_bp
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        print("✅ Auth API registered at /api/auth")
    except ImportError:
        print("⚠️  Auth blueprint not configured yet")
    except Exception as e:
        print(f"❌ Error registering Auth blueprint: {e}")
    
    try:
        from app.routes.activities import activities_bp
        app.register_blueprint(activities_bp, url_prefix='/api/activities')
        print("✅ Activities API registered at /api/activities")
    except ImportError:
        print("⚠️  Activities blueprint not configured yet")
    except Exception as e:
        print(f"❌ Error registering Activities blueprint: {e}")
    
    try:
        from app.routes.waste_scanner import waste_scanner_bp
        app.register_blueprint(waste_scanner_bp, url_prefix='/api/waste-scanner')
        print("✅ Waste Scanner API registered at /api/waste-scanner")
    except ImportError:
        print("⚠️  Waste Scanner blueprint not configured yet")
    except Exception as e:
        print(f"❌ Error registering Waste Scanner blueprint: {e}")
    
    print("✨ Blueprint registration complete!\n")

    # Placeholder welcome route
    @app.route('/')
    def home():
        return {
            "message": "Welcome to the Green-Nexus API! 🌿",
            "version": "1.0.0",
            "status": "Running"
        }, 200

    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health():
        return {
            "status": "healthy",
            "message": "Green-Nexus API is running",
            "database": "connected"
        }, 200

    return app
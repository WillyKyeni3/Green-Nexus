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
    
    # Enable CORS for all routes (configure more specifically if needed)
    CORS(app)

    # Register blueprints (routes) here after creating them
    # Example:
    # from app.routes import auth_bp
    # app.register_blueprint(auth_bp, url_prefix='/api/auth')
    # 
    # from app.routes import activities_bp
    # app.register_blueprint(activities_bp, url_prefix='/api/activities')
    # 
    # from app.routes import waste_scanner_bp
    # app.register_blueprint(waste_scanner_bp, url_prefix='/api/waste-scanner')
    # 
    # from app.routes import marketplace_bp
    # app.register_blueprint(marketplace_bp, url_prefix='/api/marketplace')

    # Placeholder welcome route
    @app.route('/')
    def home():
        return {"message": "Welcome to the Green-Nexus API!"}, 200

    return app
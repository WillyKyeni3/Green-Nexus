import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

class Config:
    # Secret key for sessions and JWT signing (use a strong, random key in production)
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-fallback-secret-key-here'
    
    # Database URI (using SQLite by default, adjust for your choice)
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///greennexus.db'
    
    # Disable Flask-SQLAlchemy's event system for modifications tracking (can reduce overhead)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'your-jwt-fallback-secret-key-here'
    
    # Upload folder for images (if needed)
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    
    # Ensure upload folder exists
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# server/config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-change-in-prod'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'dev-jwt-change-in-prod'

    # === POSTGRESQL URL FIX (Render gives postgres://) ===
    database_url = os.environ.get('DATABASE_URL')
    
    if database_url:
        # Fix Render's postgres:// to postgresql://
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
    else:
        # Check if we're in production (Render sets RENDER env var)
        if os.environ.get('RENDER'):
            raise RuntimeError(
                "DATABASE_URL environment variable is not set on Render. "
                "Please add a PostgreSQL database to your Render service."
            )
        # Local development fallback
        database_url = 'sqlite:///instance/greennexus.db'
        print("⚠️  WARNING: Using SQLite for local development")

    SQLALCHEMY_DATABASE_URI = database_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # === UPLOAD FOLDER ===
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

from flask import current_app
from app.models.user import User # Import the User model
from app import db # Import the db instance from the app package
from flask_jwt_extended import create_access_token
import re

def validate_email(email):
    """Simple email validation using regex."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None
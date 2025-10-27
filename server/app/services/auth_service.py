from flask import current_app
from app.models.user import User # Import the User model
from app import db # Import the db instance from the app package
from flask_jwt_extended import create_access_token
import re

def validate_email(email):
    """Simple email validation using regex."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def register_user(name, email, password):
    """
    Handles user registration logic.
    """
    # 1. Validate input
    if not name or not email or not password:
        return {"error": "All fields (name, email, password) are required."}, 400

    if len(password) < 8:
        return {"error": "Password must be at least 8 characters long."}, 400

    if not validate_email(email):
        return {"error": "Invalid email format."}, 400

    # 2. Check if user already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return {"error": "A user with this email already exists."}, 409 # Conflict

    # 3. Create new user
    new_user = User(name=name, email=email)
    new_user.set_password(password) # Hash the password

    # 4. Add user to the database session
    db.session.add(new_user)
    try:
        # 5. Commit the transaction
        db.session.commit()
        return {"message": "User registered successfully."}, 201
    except Exception as e:
        # 6. Rollback in case of error
        db.session.rollback()
        current_app.logger.error(f"Registration error: {str(e)}")
        return {"error": "An error occurred during registration. Please try again."}, 500
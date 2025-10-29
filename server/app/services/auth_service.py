# server/app/services/auth_service.py
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

    # --- NEW: Generate a simple username from the name ---
    # Basic sanitization: remove non-alphanumeric characters and spaces, lowercase
    # Consider potential duplicates and add a suffix if needed (simplified here)
    # In a real application, you'd need a more robust method to ensure uniqueness
    base_username = re.sub(r'[^a-zA-Z0-9_]', '', name.replace(' ', '_')).lower()
    username = base_username
    counter = 1
    # Check for uniqueness in the database
    while User.query.filter_by(username=username).first():
        username = f"{base_username}{counter}"
        counter += 1

    # 2. Check if user already exists by email
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return {"error": "A user with this email already exists."}, 409 # Conflict

    # 3. Create new user - now including the generated username
    new_user = User(name=name, email=email, username=username) # <-- Add username here
    new_user.set_password(password) # Hash the password

    # 4. Add user to the database session
    db.session.add(new_user)
    try:
        # 5. Commit the transaction
        db.session.commit()
        
        # 6. Generate JWT token for the new user
        access_token = create_access_token(identity=new_user.id) # Use user ID as identity
        
        # 7. Return success message, token, and user data
        # Include the generated username in the response if needed
        return {
            "message": "User registered successfully.",
            "access_token": access_token,
            "user": {
                "id": new_user.id,
                "username": new_user.username, 
                "name": new_user.name,
                "email": new_user.email
            }
        }, 201 # 201 Created
        
    except Exception as e:
        # 8. Rollback in case of error
        db.session.rollback()
        current_app.logger.error(f"Registration error: {str(e)}")
        # Check if the error is related to username or email constraints after potential rollback issues
        # This is a general catch; you might want more specific handling
        return {"error": "An error occurred during registration. Please try again."}, 500


def login_user(email, password):
    """
    Handles user login logic.
    """
    # 1. Validate input
    if not email or not password:
        return {"error": "Email and password are required."}, 400

    # 2. Find user by email
    user = User.query.filter_by(email=email).first()

    # 3. Check if user exists and password is correct
    if not user or not user.check_password(password):
        return {"error": "Invalid email or password."}, 401 # Unauthorized

    # 4. Generate JWT token
    access_token = create_access_token(identity=user.id) # Use user ID as identity

    # 5. Return success message and token
    return {
        "message": "Login successful.",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }, 200
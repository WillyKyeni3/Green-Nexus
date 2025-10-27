from flask import Blueprint, request, jsonify
from app.services.auth_service import register_user, login_user
from app import db # Import db to potentially use session management if needed within routes

# Create a Blueprint for authentication routes
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
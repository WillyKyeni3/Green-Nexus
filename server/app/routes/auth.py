from flask import Blueprint, request, jsonify
from app.services.auth_service import register_user, login_user
from app import db # Import db to potentially use session management if needed within routes

# Create a Blueprint for authentication routes
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Endpoint for user registration.
    Expects JSON: { "name": "...", "email": "...", "password": "..." }
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Request body must be JSON."}), 400

        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        # Call the service function
        response, status_code = register_user(name, email, password)
        return jsonify(response), status_code
    except Exception as e:
        # Log the error and return a JSON response
        print(f"Registration route error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred during registration.", "details": str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Endpoint for user login.
    Expects JSON: { "email": "...", "password": "..." }
    Returns JSON: { "message": "...", "access_token": "...", "user": {...} } on success
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Request body must be JSON."}), 400

        email = data.get('email')
        password = data.get('password')

        # Call the service function
        response, status_code = login_user(email, password)
        return jsonify(response), status_code
    except Exception as e:
        # Log the error and return a JSON response
        print(f"Login route error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred during login.", "details": str(e)}), 500
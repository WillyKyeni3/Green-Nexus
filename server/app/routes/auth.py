from flask import Blueprint, request, jsonify
from app.services.auth_service import register_user, login_user
from app import db

# Create a Blueprint for authentication routes
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    User Registration
    Register a new user account
    ---
    tags:
      - Authentication
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - name
            - email
            - password
          properties:
            name:
              type: string
              example: "John Doe"
              description: User's full name
            email:
              type: string
              format: email
              example: "john@example.com"
              description: User's email address
            password:
              type: string
              format: password
              example: "SecurePass123"
              description: User's password (min 6 characters)
    responses:
      201:
        description: User registered successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: "User registered successfully"
            user:
              type: object
              properties:
                id:
                  type: integer
                  example: 1
                name:
                  type: string
                  example: "John Doe"
                email:
                  type: string
                  example: "john@example.com"
      400:
        description: Bad request - missing fields or invalid data
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Email already exists"
      500:
        description: Server error
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON."}), 400

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # Call the service function
    response, status_code = register_user(name, email, password)
    return jsonify(response), status_code


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    User Login
    Authenticate user and get access token
    ---
    tags:
      - Authentication
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
              format: email
              example: "john@example.com"
              description: User's email address
            password:
              type: string
              format: password
              example: "SecurePass123"
              description: User's password
    responses:
      200:
        description: Login successful
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Login successful"
            access_token:
              type: string
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              description: JWT access token for authentication
            user:
              type: object
              properties:
                id:
                  type: integer
                  example: 1
                name:
                  type: string
                  example: "John Doe"
                email:
                  type: string
                  example: "john@example.com"
      400:
        description: Bad request - missing credentials
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Request body must be JSON"
      401:
        description: Unauthorized - invalid credentials
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Invalid email or password"
      500:
        description: Server error
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON."}), 400

    email = data.get('email')
    password = data.get('password')

    # Call the service function
    response, status_code = login_user(email, password)
    return jsonify(response), status_code
import os
from flask import Flask, jsonify
from dotenv import load_dotenv
from app.routes import register_blueprints

# Load .env for OpenAI key
load_dotenv()

# Get the environment (development, production, etc.)
config_name = os.getenv('FLASK_CONFIG') or 'development'

# Create the Flask application instance
app = Flask(__name__)

# Simple root welcome route
@app.route('/')
def welcome():
    return jsonify({
        'message': 'Welcome to Green-Nexus Backend! 🌿',
        'version': '1.0.0',
        'endpoints': {
            'AI Chat': '/api/chat (POST)',
            'Auth': '/api/auth/*',
            'Activities': '/api/activities/*',
            'Waste Scanner': '/api/waste/*'
        },
        'status': 'Ready for eco-friendly queries!'
    })

# Register all API blueprints
register_blueprints(app)

if __name__ == '__main__':
    # Run the server
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
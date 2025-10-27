# server/run.py
import os
from app import create_app # This should now work

# Get the environment (development, production, etc.)
config_name = os.getenv('FLASK_CONFIG') or 'development'

# Create the Flask application instance
app = create_app(config_name)

if __name__ == '__main__':
    # Run the server
    app.run(
        host='0.0.0.0', # Listen on all available interfaces
        port=5000,      # Port number
        debug=True      # Enable debug mode (development only!)
    )
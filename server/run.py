import os
from app import create_app # This should now work
# server/run.py
from flask import Flask
from app.routes import register_blueprints
from app.config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Register all routes
register_blueprints(app)

if __name__ == '__main__':
    # Run the server
    app.run(
        host='0.0.0.0', # Listen on all available interfaces
        port=5000,      # Port number
        debug=True      # Enable debug mode (development only!)
    )
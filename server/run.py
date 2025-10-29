# server/run.py
import os
from dotenv import load_dotenv
from app import create_app   # factory function from app/__init__.py

# Load environment variables (OpenAI key, DATABASE_URL, etc.)
load_dotenv()

# Optional: allow overriding config via env var
config_name = os.getenv('FLASK_CONFIG') or 'development'

# Create the Flask application instance using the factory
app = create_app(config_name=config_name)

if __name__ == '__main__':
    # Run the server (for local development)
    # Render sets the PORT environment variable, so we check for it here too
    port = int(os.getenv('PORT', 5000)) # Use Render's $PORT or default to 5000
    app.run(
        host='0.0.0.0', # Listen on all available interfaces
        port=port,      # Use the PORT environment variable or default
        debug=True      # Enable debug mode (development only!)
    )
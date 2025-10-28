# server/run.py
import os
from dotenv import load_dotenv
from app import create_app   # <-- factory function from app/__init__.py

# Load environment variables (OpenAI key, DATABASE_URL, etc.)
load_dotenv()

# Optional: allow overriding config via env var
config_name = os.getenv('FLASK_CONFIG') or 'development'

# Create the Flask app using the factory
app = create_app(config_name=config_name)

if __name__ == '__main__':
    # Run the server
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
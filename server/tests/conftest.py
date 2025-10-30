# server/tests/conftest.py
import pytest
import os
import sys

# Add parent directory to path so we can import app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.models.user import User

@pytest.fixture
def app():
    """Create application for testing"""
    # Set testing config
    os.environ['FLASK_CONFIG'] = 'testing'
    os.environ['DATABASE_URL'] = 'sqlite:///:memory:'  # Use in-memory database for tests
    
    app = create_app('testing')
    app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'WTF_CSRF_ENABLED': False,
        'JWT_SECRET_KEY': 'test-secret-key'
    })
    
    # Create tables
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    """Create test client"""
    return app.test_client()

@pytest.fixture
def runner(app):
    """Create test CLI runner"""
    return app.test_cli_runner()

@pytest.fixture
def auth_headers(client):
    """Create authenticated user and return auth headers"""
    # Register user
    client.post('/api/auth/register', json={
        'name': 'Test User',
        'email': 'test@example.com',
        'password': 'testpass123'
    })
    
    # Login
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'testpass123'
    })
    
    token = response.get_json()['access_token']
    
    return {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
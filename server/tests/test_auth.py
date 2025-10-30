# server/tests/test_auth.py
import pytest

class TestAuth:
    """Test authentication endpoints"""
    
    def test_register_success(self, client):
        """Test successful user registration"""
        response = client.post('/api/auth/register', json={
            'name': 'John Doe',
            'email': 'john@example.com',
            'password': 'securepass123'
        })
        
        assert response.status_code == 201
        data = response.get_json()
        assert 'message' in data
        assert 'user' in data
        assert data['user']['email'] == 'john@example.com'
    
    def test_register_missing_fields(self, client):
        """Test registration with missing fields"""
        response = client.post('/api/auth/register', json={
            'email': 'john@example.com'
            # Missing name and password
        })
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
    
    def test_register_duplicate_email(self, client):
        """Test registration with duplicate email"""
        # First registration
        client.post('/api/auth/register', json={
            'name': 'John Doe',
            'email': 'john@example.com',
            'password': 'securepass123'
        })
        
        # Try to register again with same email
        response = client.post('/api/auth/register', json={
            'name': 'Jane Doe',
            'email': 'john@example.com',
            'password': 'anotherpass123'
        })
        
        assert response.status_code in [400, 409] 
    
    def test_login_success(self, client):
        """Test successful login"""
        # Register first
        client.post('/api/auth/register', json={
            'name': 'John Doe',
            'email': 'john@example.com',
            'password': 'securepass123'
        })
        
        # Then login
        response = client.post('/api/auth/login', json={
            'email': 'john@example.com',
            'password': 'securepass123'
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'access_token' in data
        assert 'user' in data
        assert 'Login successful' in data['message'] 
    def test_login_wrong_password(self, client):
        """Test login with incorrect password"""
        # Register first
        client.post('/api/auth/register', json={
            'name': 'John Doe',
            'email': 'john@example.com',
            'password': 'securepass123'
        })
        
        # Try to login with wrong password
        response = client.post('/api/auth/login', json={
            'email': 'john@example.com',
            'password': 'wrongpassword'
        })
        
        assert response.status_code == 401
    
    def test_login_nonexistent_user(self, client):
        """Test login with non-existent email"""
        response = client.post('/api/auth/login', json={
            'email': 'nonexistent@example.com',
            'password': 'somepassword'
        })
        
        assert response.status_code == 401
    
    def test_login_missing_credentials(self, client):
        """Test login with missing credentials"""
        response = client.post('/api/auth/login', json={
            'email': 'john@example.com'
            # Missing password
        })
        
        assert response.status_code == 400
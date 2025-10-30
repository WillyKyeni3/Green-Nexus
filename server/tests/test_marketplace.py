# server/tests/test_marketplace.py
import pytest
import os

class TestMarketplace:
    """Test AI marketplace chat endpoints"""
    
    @pytest.mark.skipif(
        not os.getenv('OPENAI_API_KEY'),
        reason="OpenAI API key not configured"
    )
    def test_chat_success(self, client):
        """Test successful chat request (requires OpenAI key)"""
        response = client.post('/api/chat', json={
            'message': 'best sustainable water bottles'
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'response' in data
        assert len(data['response']) > 0
    
    def test_chat_missing_message(self, client):
        """Test chat with missing message"""
        response = client.post('/api/chat', json={})
        
        assert response.status_code == 200 or response.status_code == 400
        data = response.get_json()
        assert 'response' in data or 'error' in data
    
    def test_chat_empty_message(self, client):
        """Test chat with empty message"""
        response = client.post('/api/chat', json={
            'message': ''
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'response' in data
    
    def test_chat_invalid_json(self, client):
        """Test chat with invalid JSON"""
        response = client.post('/api/chat',
                              data='invalid json',
                              content_type='application/json')
        
        assert response.status_code in [400, 500]
    
    def test_chat_health_check(self, client):
        """Test chat health check endpoint"""
        response = client.get('/api/chat/health')
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'healthy'
        assert data['service'] == 'marketplace'
        assert 'openai_configured' in data
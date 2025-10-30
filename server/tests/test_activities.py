# server/tests/test_activities.py
import pytest

class TestActivities:
    """Test activities endpoints"""
    
    def test_log_activity_success(self, client):
        """Test successfully logging an activity"""
        response = client.post('/api/activities/log', json={
            'user_id': 1,
            'activity_type': 'recycling',
            'quantity': 5.0,
            'unit': 'kg',
            'category': 'waste',
            'notes': 'Recycled plastic bottles'
        })
        
        assert response.status_code == 201
        data = response.get_json()
        assert 'message' in data
        assert 'activity' in data
        assert 'carbon_saved' in data['activity']
    
    def test_log_activity_missing_fields(self, client):
        """Test logging activity with missing required fields"""
        response = client.post('/api/activities/log', json={
            'user_id': 1,
            'activity_type': 'recycling'
            # Missing quantity, unit, category
        })
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
    
    def test_get_user_activities(self, client):
        """Test getting user's activities"""
        # First log an activity
        client.post('/api/activities/log', json={
            'user_id': 1,
            'activity_type': 'recycling',
            'quantity': 5.0,
            'unit': 'kg',
            'category': 'waste'
        })
        
        # Then retrieve activities
        response = client.get('/api/activities/1')
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'activities' in data
        assert len(data['activities']) > 0
    
    def test_get_activity_types(self, client):
        """Test getting all activity types"""
        response = client.get('/api/activities/types')
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'activity_types' in data
    
    def test_get_weekly_stats(self, client):
        """Test getting weekly statistics"""
        # First log some activities
        client.post('/api/activities/log', json={
            'user_id': 1,
            'activity_type': 'recycling',
            'quantity': 5.0,
            'unit': 'kg',
            'category': 'waste'
        })
        
        # Get weekly stats
        response = client.get('/api/activities/weekly-stats/1')
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'total_carbon_saved' in data or 'activities_count' in data
    
    def test_update_activity(self, client):
        """Test updating an activity"""
        # First log an activity
        log_response = client.post('/api/activities/log', json={
            'user_id': 1,
            'activity_type': 'recycling',
            'quantity': 5.0,
            'unit': 'kg',
            'category': 'waste'
        })
        
        activity_id = log_response.get_json()['activity']['id']
        
        # Update the activity
        response = client.put(f'/api/activities/1/{activity_id}', json={
            'activity_type': 'recycling',
            'quantity': 7.5,
            'unit': 'kg',
            'notes': 'Updated amount'
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'message' in data
    
    def test_delete_activity(self, client):
        """Test deleting an activity"""
        # First log an activity
        log_response = client.post('/api/activities/log', json={
            'user_id': 1,
            'activity_type': 'recycling',
            'quantity': 5.0,
            'unit': 'kg',
            'category': 'waste'
        })
        
        activity_id = log_response.get_json()['activity']['id']
        
        # Delete the activity
        response = client.delete(f'/api/activities/1/{activity_id}')
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'message' in data
    
    def test_activities_health_check(self, client):
        """Test activities health check endpoint"""
        response = client.get('/api/activities/health')
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'healthy'
        assert data['service'] == 'activities'
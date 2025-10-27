from flask import Blueprint, request, jsonify
activities_bp = Blueprint('activities', __name__)
from app.services.activity_service import ActivityService

activities_bp = Blueprint('activities', __name__, url_prefix='/api/activities')

@activities_bp.route('/log', methods=['POST'])
def log_activity():
    """
    Log a new activity
    
    Request JSON:
    {
        "user_id": 1,
        "activity_type": "Cycling",
        "quantity": 5,
        "unit": "km",
        "category": "Transport",
        "notes": "Morning bike ride to work"
    }
    """
    try:
        print("\n" + "="*50)
        print("🌍 LOG ACTIVITY REQUEST")
        print("="*50)
        
        if not request.is_json:
            print("❌ ERROR: Request is not JSON")
            return jsonify({'error': 'Request must be JSON'}), 400
        
        data = request.get_json()
        print(f"📍 Request data: {data}")
        
        # Validate required fields
        required_fields = ['user_id', 'activity_type', 'quantity', 'unit', 'category']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            print(f"❌ ERROR: Missing fields: {missing_fields}")
            return jsonify({
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400
        
        user_id = data.get('user_id')
        activity_type = data.get('activity_type')
        quantity = data.get('quantity')
        unit = data.get('unit')
        category = data.get('category')
        notes = data.get('notes', '')
        
        print(f"📋 Activity Type: {activity_type}, Quantity: {quantity} {unit}")
        
        # Call service
        result, status_code = ActivityService.log_activity(
            user_id=user_id,
            activity_type=activity_type,
            quantity=quantity,
            unit=unit,
            category=category,
            notes=notes
        )
        
        if status_code == 201:
            print(f"✅ Activity logged successfully")
            print(f"🌱 Carbon saved: {result.get('carbon_saved')} kg CO₂")
        else:
            print(f"❌ ERROR: {result}")
        
        print("="*50 + "\n")
        return jsonify(result), status_code
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        print("="*50 + "\n")
        return jsonify({'error': str(e)}), 500


@activities_bp.route('/<int:user_id>', methods=['GET'])
def get_activities(user_id):
    """
    Get activities for a user
    
    Query parameters:
    - limit: Number of activities to return (default: 10)
    - category: Filter by category (Transport, Food, Purchases)
    """
    try:
        print(f"📥 Getting activities for user {user_id}")
        
        limit = request.args.get('limit', 10, type=int)
        category = request.args.get('category', None)
        
        result, status_code = ActivityService.get_user_activities(
            user_id=user_id,
            limit=limit,
            category=category
        )
        
        print(f"✅ Retrieved {len(result)} activities")
        return jsonify(result), status_code
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return jsonify({'error': str(e)}), 500


@activities_bp.route('/weekly-stats/<int:user_id>', methods=['GET'])
def get_weekly_stats(user_id):
    """
    Get weekly activity statistics for a user
    """
    try:
        print(f"📊 Getting weekly stats for user {user_id}")
        
        result, status_code = ActivityService.get_weekly_stats(user_id)
        
        if status_code == 200:
            print(f"✅ Total carbon saved this week: {result['total_carbon_saved']} kg CO₂")
        
        return jsonify(result), status_code
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return jsonify({'error': str(e)}), 500


@activities_bp.route('/category-breakdown/<int:user_id>', methods=['GET'])
def get_category_breakdown(user_id):
    """
    Get breakdown of activities by category
    
    Query parameters:
    - days: Number of days to look back (default: 30)
    """
    try:
        days = request.args.get('days', 30, type=int)
        print(f"📈 Getting category breakdown for user {user_id} (last {days} days)")
        
        result, status_code = ActivityService.get_category_breakdown(user_id, days)
        
        return jsonify(result), status_code
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return jsonify({'error': str(e)}), 500


@activities_bp.route('/<int:user_id>/<int:activity_id>', methods=['DELETE'])
def delete_activity(user_id, activity_id):
    """
    Delete an activity
    """
    try:
        print(f"🗑️  Deleting activity {activity_id} for user {user_id}")
        
        result, status_code = ActivityService.delete_activity(user_id, activity_id)
        
        if status_code == 200:
            print(f"✅ Activity deleted successfully")
        
        return jsonify(result), status_code
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return jsonify({'error': str(e)}), 500


@activities_bp.route('/types', methods=['GET'])
def get_activity_types():
    """
    Get all available activity types and their conversions
    """
    try:
        print("📋 Getting activity types")
        
        result, status_code = ActivityService.get_activity_types()
        
        return jsonify(result), status_code
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return jsonify({'error': str(e)}), 500


@activities_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'activities',
        'message': 'Activities API is running'
    }), 200
from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from app import db
from app.models.user import User
from app.models.activity import Activity

activities_bp = Blueprint('activities', __name__, url_prefix='/api/activities')

# Activity type to carbon conversion mapping (kg CO2)
ACTIVITY_CONVERSIONS = {
    'Cycling': {'unit': 'km', 'conversion': 0.21},
    'Public Transit': {'unit': 'km', 'conversion': 0.089},
    'Walking': {'unit': 'km', 'conversion': 0},
    'Vegetarian Meal': {'unit': 'meals', 'conversion': 2.5},
    'Recycling': {'unit': 'kg', 'conversion': 1.5},
    'Energy Conservation': {'unit': 'kWh', 'conversion': 0.92},
    'Water Conservation': {'unit': 'liters', 'conversion': 0.0002},
}


@activities_bp.route('/types', methods=['GET'])
def get_activity_types():
    """Get all available activity types"""
    try:
        print("\n📋 Getting activity types")
        
        types = list(ACTIVITY_CONVERSIONS.keys())
        
        result = {
            'activity_types': types,
            'conversions': ACTIVITY_CONVERSIONS
        }
        
        print(f"✅ Returning {len(types)} activity types")
        return jsonify(result), 200
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@activities_bp.route('/log', methods=['POST'])
def log_activity():
    """Log a new activity"""
    try:
        print("\n" + "="*50)
        print("🌍 LOG ACTIVITY REQUEST")
        print("="*50)
        
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400
        
        data = request.get_json()
        print(f"📍 Request data: {data}")
        
        # Validate required fields
        required_fields = ['user_id', 'activity_type', 'quantity', 'unit', 'category']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400
        
        user_id = data.get('user_id')
        activity_type = data.get('activity_type')
        quantity = float(data.get('quantity', 0))
        unit = data.get('unit')
        category = data.get('category')
        notes = data.get('notes', '')
        
        # Verify user exists
        user = User.query.get(user_id)
        if not user:
            print(f"⚠️  User {user_id} not found, creating test user...")
            # For testing, create a default user if it doesn't exist
            user = User(id=user_id, username=f'user_{user_id}', email=f'user{user_id}@example.com', password='temp')
            db.session.add(user)
            db.session.commit()
            print(f"✅ Test user created: {user.username}")
        
        # Calculate carbon saved
        conversion_data = ACTIVITY_CONVERSIONS.get(activity_type, {})
        conversion_factor = conversion_data.get('conversion', 0)
        carbon_saved = quantity * conversion_factor
        
        print(f"📋 Activity: {activity_type}, Quantity: {quantity} {unit}")
        print(f"🌱 Carbon conversion factor: {conversion_factor}")
        print(f"🌱 Carbon saved: {carbon_saved} kg CO₂")
        
        # Create activity
        activity = Activity(
            user_id=user_id,
            activity_type=activity_type,
            quantity=quantity,
            unit=unit,
            category=category,
            carbon_saved=carbon_saved,
            notes=notes,
            created_at=datetime.utcnow()
        )
        
        db.session.add(activity)
        
        # Update user's total carbon saved
        user.total_carbon_saved += carbon_saved
        user.green_score = min(100, user.total_carbon_saved * 5)  # Simple calculation
        
        db.session.commit()
        
        print(f"✅ Activity logged successfully (ID: {activity.id})")
        print(f"✅ User total carbon saved: {user.total_carbon_saved}")
        print("="*50 + "\n")
        
        return jsonify({
            'id': activity.id,
            'activity_type': activity_type,
            'quantity': quantity,
            'unit': unit,
            'carbon_saved': carbon_saved,
            'message': 'Activity logged successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ ERROR: {str(e)}")
        print("="*50 + "\n")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@activities_bp.route('/<int:user_id>', methods=['GET'])
def get_activities(user_id):
    """Get activities for a user"""
    try:
        print(f"\n📥 Getting activities for user {user_id}")
        
        limit = request.args.get('limit', 10, type=int)
        category = request.args.get('category', None)
        
        # Build query
        query = Activity.query.filter_by(user_id=user_id)
        
        if category:
            query = query.filter_by(category=category)
        
        # Order by most recent and limit
        activities = query.order_by(Activity.created_at.desc()).limit(limit).all()
        
        print(f"✅ Retrieved {len(activities)} activities")
        
        # Format response
        result = [
            {
                'id': a.id,
                'activity_type': a.activity_type,
                'quantity': a.quantity,
                'unit': a.unit,
                'category': a.category,
                'carbon_saved': a.carbon_saved,
                'notes': a.notes,
                'created_at': a.created_at.isoformat() if a.created_at else None,
            }
            for a in activities
        ]
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@activities_bp.route('/weekly-stats/<int:user_id>', methods=['GET'])
def get_weekly_stats(user_id):
    """Get weekly statistics for a user"""
    try:
        print(f"\n📊 Getting weekly stats for user {user_id}")
        
        # Get activities from last 7 days
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        activities = Activity.query.filter(
            Activity.user_id == user_id,
            Activity.created_at >= seven_days_ago
        ).all()
        
        # Calculate stats
        total_carbon_saved = sum(a.carbon_saved for a in activities)
        total_activities = len(activities)
        
        # Group by day
        daily_stats = {}
        for activity in activities:
            day_name = activity.created_at.strftime('%A')
            if day_name not in daily_stats:
                daily_stats[day_name] = {'count': 0, 'carbon_saved': 0}
            daily_stats[day_name]['count'] += 1
            daily_stats[day_name]['carbon_saved'] += activity.carbon_saved
        
        print(f"✅ Total CO₂ saved this week: {total_carbon_saved:.2f} kg")
        print(f"✅ Total activities: {total_activities}")
        
        result = {
            'total_carbon_saved': total_carbon_saved,
            'total_activities': total_activities,
            'period': 'last_7_days',
            'daily_stats': daily_stats
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@activities_bp.route('/<int:user_id>/<int:activity_id>', methods=['DELETE'])
def delete_activity(user_id, activity_id):
    """Delete an activity"""
    try:
        print(f"\n🗑️  Deleting activity {activity_id} for user {user_id}")
        
        activity = Activity.query.filter_by(
            id=activity_id,
            user_id=user_id
        ).first()
        
        if not activity:
            return jsonify({'error': 'Activity not found'}), 404
        
        # Update user's total carbon saved
        user = User.query.get(user_id)
        if user:
            user.total_carbon_saved -= activity.carbon_saved
            user.green_score = max(0, user.green_score - 5)
        
        db.session.delete(activity)
        db.session.commit()
        
        print(f"✅ Activity deleted successfully")
        return jsonify({'message': 'Activity deleted'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@activities_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'activities',
        'message': 'Activities API is running'
    }), 200
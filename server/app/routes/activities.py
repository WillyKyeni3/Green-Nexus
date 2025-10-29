# server/app/routes/activities.py
from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from app.models.activity import Activity
from app.services.activity_service import ActivityService
from app.constants import ACTIVITY_CONVERSIONS  # ONLY THIS

# ONE BLUEPRINT ONLY
activities_bp = Blueprint('activities', __name__)

# ----------------------------------------------------------------------
#  PUT /api/activities/<user_id>/<activity_id>
# ----------------------------------------------------------------------
@activities_bp.route('/<int:user_id>/<int:activity_id>', methods=['PUT'])
def update_activity(user_id, activity_id):
    """Update an activity."""
    try:
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400

        data = request.get_json()
        required = ['activity_type', 'quantity', 'unit']
        missing = [f for f in required if f not in data]
        if missing:
            return jsonify({'error': f'Missing: {", ".join(missing)}'}), 400

        activity_type = data['activity_type']
        quantity = float(data.get('quantity', 0))
        unit = data['unit']
        notes = data.get('notes', '')

        # Update via service
        result, status = ActivityService.update_activity(
            user_id, activity_id, activity_type, quantity, unit, notes
        )
        if status != 200:
            return jsonify(result), status

        # Update user stats
        user = User.query.get(user_id)
        if user:
            db.session.commit()

        return jsonify(result), 200

    except Exception as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ----------------------------------------------------------------------
#  GET /api/activities/types
# ----------------------------------------------------------------------
@activities_bp.route('/types', methods=['GET'])
def get_activity_types():
    """Return all activity types and conversion data."""
    try:
        result, status = ActivityService.get_activity_types()
        return jsonify(result), status
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ----------------------------------------------------------------------
#  POST /api/activities/log
# ----------------------------------------------------------------------
@activities_bp.route('/log', methods=['POST'])
def log_activity():
    """Log a new activity."""
    try:
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400

        data = request.get_json()
        required = ['user_id', 'activity_type', 'quantity', 'unit', 'category']
        missing = [f for f in required if f not in data]
        if missing:
            return jsonify({'error': f'Missing: {", ".join(missing)}'}), 400

        user_id = data['user_id']
        activity_type = data['activity_type']
        quantity = float(data.get('quantity', 0))
        unit = data['unit']
        category = data['category']
        notes = data.get('notes', '')

        # Auto-create test user
        user = User.query.get(user_id)
        if not user:
            user = User(
                id=user_id,
                username=f'user_{user_id}',
                email=f'user{user_id}@example.com',
                password='temp'
            )
            db.session.add(user)
            db.session.commit()

        # Log via service
        result, status = ActivityService.log_activity(
            user_id, activity_type, quantity, unit, category, notes
        )
        if status != 201:
            return jsonify(result), status

        # Update user stats
        user.total_carbon_saved += result['carbon_saved']
        user.green_score = min(100, user.total_carbon_saved * 5)
        db.session.commit()

        return jsonify(result), 201

    except Exception as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ----------------------------------------------------------------------
#  GET /api/activities/<user_id>
# ----------------------------------------------------------------------
@activities_bp.route('/<int:user_id>', methods=['GET'])
def get_activities(user_id):
    """Get recent activities for a user."""
    try:
        limit = request.args.get('limit', 10, type=int)
        category = request.args.get('category')
        result, status = ActivityService.get_user_activities(user_id, limit, category)
        return jsonify(result), status
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ----------------------------------------------------------------------
#  GET /api/activities/weekly-stats/<user_id>
# ----------------------------------------------------------------------
@activities_bp.route('/weekly-stats/<int:user_id>', methods=['GET'])
def get_weekly_stats(user_id):
    """Get weekly stats."""
    try:
        result, status = ActivityService.get_weekly_stats(user_id)
        return jsonify(result), status
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ----------------------------------------------------------------------
#  DELETE /api/activities/<user_id>/<activity_id>
# ----------------------------------------------------------------------
@activities_bp.route('/<int:user_id>/<int:activity_id>', methods=['DELETE'])
def delete_activity(user_id, activity_id):
    """Delete an activity."""
    try:
        result, status = ActivityService.delete_activity(user_id, activity_id)
        if status != 200:
            return jsonify(result), status

        user = User.query.get(user_id)
        if user:
            act = Activity.query.get(activity_id)
            if act:
                user.total_carbon_saved = max(0, user.total_carbon_saved - act.carbon_saved)
                user.green_score = max(0, user.green_score - 5)
                db.session.commit()

        return jsonify(result), 200
    except Exception as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ----------------------------------------------------------------------
#  GET /api/activities/health
# ----------------------------------------------------------------------
@activities_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'activities',
        'message': 'Activities API is running'
    }), 200
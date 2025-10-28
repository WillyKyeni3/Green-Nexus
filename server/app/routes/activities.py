# server/app/routes/activities.py
from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from app import db
from app.models.user import User
from app.models.activity import Activity
from app.services.activity_service import ActivityService
from app.constants import ACTIVITY_CONVERSIONS   # <-- shared constant

activities_bp = Blueprint('activities', __name__)

# ----------------------------------------------------------------------
#  GET /api/activities/types
# ----------------------------------------------------------------------
@activities_bp.route('/types', methods=['GET'])
def get_activity_types():
    """Return the list of all activity types and their conversion data."""
    try:
        print("\nGetting activity types")
        result, status = ActivityService.get_activity_types()
        print(f"Returning {len(result['activity_types'])} activity types")
        return jsonify(result), status
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ----------------------------------------------------------------------
#  POST /api/activities/log
# ----------------------------------------------------------------------
@activities_bp.route('/log', methods=['POST'])
def log_activity():
    """Log a new activity for a user."""
    try:
        print("\n" + "="*50)
        print("LOG ACTIVITY REQUEST")
        print("="*50)

        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400

        data = request.get_json()
        print(f"Request data: {data}")

        required = ['user_id', 'activity_type', 'quantity', 'unit', 'category']
        missing = [f for f in required if f not in data]
        if missing:
            return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400

        user_id      = data['user_id']
        activity_type = data['activity_type']
        quantity     = float(data.get('quantity', 0))
        unit         = data['unit']
        category     = data['category']
        notes        = data.get('notes', '')

        # ---- Ensure user exists (test-user creation for dev only) ----
        user = User.query.get(user_id)
        if not user:
            print(f"User {user_id} not found – creating test user")
            user = User(
                id=user_id,
                username=f'user_{user_id}',
                email=f'user{user_id}@example.com',
                password='temp'
            )
            db.session.add(user)
            db.session.commit()
            print(f"Test user created: {user.username}")

        # ---- Log via service -------------------------------------------------
        result, status = ActivityService.log_activity(
            user_id, activity_type, quantity, unit, category, notes
        )
        if status != 201:
            return jsonify(result), status

        # ---- Update user totals ------------------------------------------------
        user.total_carbon_saved += result['carbon_saved']
        user.green_score = min(100, user.total_carbon_saved * 5)
        db.session.commit()

        print(f"Activity logged (ID: {result['id']})")
        print(f"User total carbon saved: {user.total_carbon_saved}")
        print("="*50 + "\n")
        return jsonify(result), 201

    except Exception as e:
        db.session.rollback()
        print(f"ERROR: {str(e)}")
        print("="*50 + "\n")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ----------------------------------------------------------------------
#  GET /api/activities/<int:user_id>
# ----------------------------------------------------------------------
@activities_bp.route('/<int:user_id>', methods=['GET'])
def get_activities(user_id):
    """Return recent activities for a user."""
    try:
        print(f"\nGetting activities for user {user_id}")

        limit    = request.args.get('limit', 10, type=int)
        category = request.args.get('category')

        result, status = ActivityService.get_user_activities(user_id, limit, category)
        if status != 200:
            return jsonify(result), status

        print(f"Retrieved {len(result)} activities")
        return jsonify(result), 200

    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ----------------------------------------------------------------------
#  GET /api/activities/weekly-stats/<int:user_id>
# ----------------------------------------------------------------------
@activities_bp.route('/weekly-stats/<int:user_id>', methods=['GET'])
def get_weekly_stats(user_id):
    """Return weekly activity statistics."""
    try:
        print(f"\nGetting weekly stats for user {user_id}")

        result, status = ActivityService.get_weekly_stats(user_id)
        if status != 200:
            return jsonify(result), status

        print(f"Total CO₂ saved this week: {result['total_carbon_saved']:.2f} kg")
        print(f"Total activities: {result['total_activities']}")
        return jsonify(result), 200

    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ----------------------------------------------------------------------
#  DELETE /api/activities/<int:user_id>/<int:activity_id>
# ----------------------------------------------------------------------
@activities_bp.route('/<int:user_id>/<int:activity_id>', methods=['DELETE'])
def delete_activity(user_id, activity_id):
    """Delete a specific activity and adjust user totals."""
    try:
        print(f"\nDeleting activity {activity_id} for user {user_id}")

        result, status = ActivityService.delete_activity(user_id, activity_id)
        if status != 200:
            return jsonify(result), status

        # ---- Adjust user totals ------------------------------------------------
        user = User.query.get(user_id)
        if user:
            act = Activity.query.get(activity_id)
            if act:
                user.total_carbon_saved = max(0, user.total_carbon_saved - act.carbon_saved)
                user.green_score = max(0, user.green_score - 5)
                db.session.commit()

        print("Activity deleted successfully")
        return jsonify(result), 200

    except Exception as e:
        db.session.rollback()
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ----------------------------------------------------------------------
#  GET /api/activities/health
# ----------------------------------------------------------------------
@activities_bp.route('/health', methods=['GET'])
def health_check():
    """Simple health-check endpoint."""
    return jsonify({
        'status': 'healthy',
        'service': 'activities',
        'message': 'Activities API is running'
    }), 200
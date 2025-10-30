# server/app/routes/activities.py
from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from app.models.activity import Activity
from app.services.activity_service import ActivityService
from app.constants import ACTIVITY_CONVERSIONS

# ONE BLUEPRINT ONLY
activities_bp = Blueprint('activities', __name__)

# ----------------------------------------------------------------------
#  POST /api/activities/log
# ----------------------------------------------------------------------
@activities_bp.route('/log', methods=['POST'])
def log_activity():
    """
    Log New Activity
    Record a new environmental activity and calculate carbon savings
    ---
    tags:
      - Activities
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - user_id
            - activity_type
            - quantity
            - unit
            - category
          properties:
            user_id:
              type: integer
              example: 1
              description: ID of the user logging the activity
            activity_type:
              type: string
              example: "recycling"
              description: Type of activity (recycling, composting, etc.)
            quantity:
              type: number
              example: 5.0
              description: Quantity of the activity
            unit:
              type: string
              example: "kg"
              description: Unit of measurement
            category:
              type: string
              example: "waste"
              description: Category of activity
            notes:
              type: string
              example: "Recycled plastic bottles"
              description: Optional notes about the activity
    responses:
      201:
        description: Activity logged successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Activity logged successfully"
            activity:
              type: object
              properties:
                id:
                  type: integer
                activity_type:
                  type: string
                quantity:
                  type: number
                unit:
                  type: string
                carbon_saved:
                  type: number
                  example: 2.5
                  description: CO2 saved in kg
            user_stats:
              type: object
              properties:
                total_carbon_saved:
                  type: number
                green_score:
                  type: number
      400:
        description: Bad request - missing required fields
      500:
        description: Server error
    """
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
    """
    Get User Activities
    Retrieve recent activities for a specific user
    ---
    tags:
      - Activities
    parameters:
      - in: path
        name: user_id
        required: true
        type: integer
        description: ID of the user
      - in: query
        name: limit
        type: integer
        default: 10
        description: Maximum number of activities to return
      - in: query
        name: category
        type: string
        description: Filter by activity category (optional)
    responses:
      200:
        description: List of activities retrieved successfully
        schema:
          type: object
          properties:
            activities:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                  activity_type:
                    type: string
                  quantity:
                    type: number
                  unit:
                    type: string
                  carbon_saved:
                    type: number
                  category:
                    type: string
                  notes:
                    type: string
                  timestamp:
                    type: string
                    format: date-time
      404:
        description: User not found
      500:
        description: Server error
    """
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
#  GET /api/activities/types
# ----------------------------------------------------------------------
@activities_bp.route('/types', methods=['GET'])
def get_activity_types():
    """
    Get Activity Types
    Return all available activity types and conversion data
    ---
    tags:
      - Activities
    responses:
      200:
        description: Activity types retrieved successfully
        schema:
          type: object
          properties:
            activity_types:
              type: object
              description: Dictionary of activity types with conversion factors
              example:
                recycling:
                  kg: 0.5
                  lbs: 0.227
                composting:
                  kg: 0.3
                  lbs: 0.136
      500:
        description: Server error
    """
    try:
        result, status = ActivityService.get_activity_types()
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
    """
    Get Weekly Statistics
    Retrieve weekly carbon savings statistics for a user
    ---
    tags:
      - Activities
    parameters:
      - in: path
        name: user_id
        required: true
        type: integer
        description: ID of the user
    responses:
      200:
        description: Weekly stats retrieved successfully
        schema:
          type: object
          properties:
            total_carbon_saved:
              type: number
              example: 15.5
              description: Total CO2 saved this week in kg
            activities_count:
              type: integer
              example: 12
            daily_breakdown:
              type: array
              items:
                type: object
                properties:
                  date:
                    type: string
                  carbon_saved:
                    type: number
      404:
        description: User not found
      500:
        description: Server error
    """
    try:
        result, status = ActivityService.get_weekly_stats(user_id)
        return jsonify(result), status
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ----------------------------------------------------------------------
#  PUT /api/activities/<user_id>/<activity_id>
# ----------------------------------------------------------------------
@activities_bp.route('/<int:user_id>/<int:activity_id>', methods=['PUT'])
def update_activity(user_id, activity_id):
    """
    Update Activity
    Modify an existing activity
    ---
    tags:
      - Activities
    parameters:
      - in: path
        name: user_id
        required: true
        type: integer
        description: ID of the user
      - in: path
        name: activity_id
        required: true
        type: integer
        description: ID of the activity to update
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - activity_type
            - quantity
            - unit
          properties:
            activity_type:
              type: string
              example: "recycling"
            quantity:
              type: number
              example: 7.5
            unit:
              type: string
              example: "kg"
            notes:
              type: string
              example: "Updated recycling amount"
    responses:
      200:
        description: Activity updated successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Activity updated successfully"
            activity:
              type: object
      400:
        description: Bad request - missing fields
      404:
        description: Activity not found
      500:
        description: Server error
    """
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
#  DELETE /api/activities/<user_id>/<activity_id>
# ----------------------------------------------------------------------
@activities_bp.route('/<int:user_id>/<int:activity_id>', methods=['DELETE'])
def delete_activity(user_id, activity_id):
    """
    Delete Activity
    Remove an activity and update user statistics
    ---
    tags:
      - Activities
    parameters:
      - in: path
        name: user_id
        required: true
        type: integer
        description: ID of the user
      - in: path
        name: activity_id
        required: true
        type: integer
        description: ID of the activity to delete
    responses:
      200:
        description: Activity deleted successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Activity deleted successfully"
      404:
        description: Activity not found
      500:
        description: Server error
    """
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
    """
    Health Check
    Check if the Activities API is running
    ---
    tags:
      - Activities
    responses:
      200:
        description: Service is healthy
        schema:
          type: object
          properties:
            status:
              type: string
              example: "healthy"
            service:
              type: string
              example: "activities"
            message:
              type: string
              example: "Activities API is running"
    """
    return jsonify({
        'status': 'healthy',
        'service': 'activities',
        'message': 'Activities API is running'
    }), 200
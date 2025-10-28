from app.models.activity import Activity, ACTIVITY_CONVERSIONS
from app import db
from datetime import datetime, timedelta

class ActivityService:
    """Service for managing user activities"""
    
    @staticmethod
    def log_activity(user_id, activity_type, quantity, unit, category, notes=None):
        """
        Log a new activity for a user
        
        Args:
            user_id: ID of the user
            activity_type: Type of activity (e.g., 'Cycling', 'Public Transit')
            quantity: Amount/distance of activity
            unit: Unit of measurement
            category: Category (Transport, Food, Purchases)
            notes: Optional notes
            
        Returns:
            Activity object or error dict
        """
        try:
            # Validate activity type
            if activity_type not in ACTIVITY_CONVERSIONS:
                return {
                    'error': f'Invalid activity type: {activity_type}',
                    'valid_types': list(ACTIVITY_CONVERSIONS.keys())
                }, 400
            
            # Get conversion data
            conversion = ACTIVITY_CONVERSIONS[activity_type]
            
            # Validate unit
            if unit != conversion['unit']:
                return {
                    'error': f'Invalid unit for {activity_type}. Expected {conversion["unit"]}, got {unit}',
                }, 400
            
            # Calculate carbon saved
            carbon_saved = float(quantity) * conversion['conversion']
            
            # Create activity
            activity = Activity(
                user_id=user_id,
                activity_type=activity_type,
                category=category,
                quantity=float(quantity),
                unit=unit,
                carbon_saved=carbon_saved,
                notes=notes
            )
            
            db.session.add(activity)
            db.session.commit()
            
            return activity.to_dict(), 201
            
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500
    
    @staticmethod
    def get_user_activities(user_id, limit=10, category=None):
        """
        Get activities for a user
        
        Args:
            user_id: ID of the user
            limit: Maximum number of activities to return
            category: Optional filter by category (Transport, Food, Purchases)
            
        Returns:
            List of activities
        """
        try:
            query = Activity.query.filter_by(user_id=user_id)
            
            if category:
                query = query.filter_by(category=category)
            
            activities = query.order_by(Activity.created_at.desc()).limit(limit).all()
            
            return [activity.to_dict() for activity in activities], 200
            
        except Exception as e:
            return {'error': str(e)}, 500
    
    @staticmethod
    def get_weekly_stats(user_id):
        """
        Get activity statistics for the past week
        
        Args:
            user_id: ID of the user
            
        Returns:
            Weekly statistics
        """
        try:
            # Get activities from the past 7 days
            seven_days_ago = datetime.utcnow() - timedelta(days=7)
            
            activities = Activity.query.filter(
                Activity.user_id == user_id,
                Activity.created_at >= seven_days_ago
            ).all()
            
            # Calculate statistics
            total_carbon_saved = sum(a.carbon_saved for a in activities)
            activity_count = len(activities)
            
            # Group by day
            daily_stats = {}
            for activity in activities:
                day = activity.created_at.strftime('%A')
                if day not in daily_stats:
                    daily_stats[day] = {
                        'count': 0,
                        'carbon_saved': 0
                    }
                daily_stats[day]['count'] += 1
                daily_stats[day]['carbon_saved'] += activity.carbon_saved
            
            return {
                'total_carbon_saved': round(total_carbon_saved, 2),
                'total_activities': activity_count,
                'daily_stats': daily_stats,
                'period': 'last_7_days'
            }, 200
            
        except Exception as e:
            return {'error': str(e)}, 500
    
    @staticmethod
    def get_category_breakdown(user_id, days=30):
        """
        Get breakdown of activities by category
        
        Args:
            user_id: ID of the user
            days: Number of days to look back
            
        Returns:
            Category breakdown
        """
        try:
            date_limit = datetime.utcnow() - timedelta(days=days)
            
            activities = Activity.query.filter(
                Activity.user_id == user_id,
                Activity.created_at >= date_limit
            ).all()
            
            breakdown = {
                'Transport': {'count': 0, 'carbon_saved': 0},
                'Food': {'count': 0, 'carbon_saved': 0},
                'Purchases': {'count': 0, 'carbon_saved': 0},
                'Other': {'count': 0, 'carbon_saved': 0}
            }
            
            for activity in activities:
                category = activity.category if activity.category in breakdown else 'Other'
                breakdown[category]['count'] += 1
                breakdown[category]['carbon_saved'] += activity.carbon_saved
            
            return breakdown, 200
            
        except Exception as e:
            return {'error': str(e)}, 500
    
    @staticmethod
    def delete_activity(user_id, activity_id):
        """
        Delete an activity
        
        Args:
            user_id: ID of the user
            activity_id: ID of the activity to delete
            
        Returns:
            Success message or error
        """
        try:
            activity = Activity.query.filter_by(
                id=activity_id,
                user_id=user_id
            ).first()
            
            if not activity:
                return {'error': 'Activity not found'}, 404
            
            db.session.delete(activity)
            db.session.commit()
            
            return {'message': 'Activity deleted successfully'}, 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500
    
    @staticmethod
    def get_activity_types():
        """Get all available activity types"""
        return {
            'activity_types': list(ACTIVITY_CONVERSIONS.keys()),
            'conversions': ACTIVITY_CONVERSIONS
        }, 200
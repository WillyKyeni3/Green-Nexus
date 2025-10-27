from app import db
from datetime import datetime

class Activity(db.Model):
    """Activity model for tracking user eco-friendly activities"""
    __tablename__ = 'activities'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Activity details
    activity_type = db.Column(db.String(50), nullable=False)  # Transport, Food, Purchases, Recycling, etc.
    category = db.Column(db.String(20), nullable=False)  # Transport, Food, Purchases
    quantity = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(20), nullable=False)  # km, miles, minutes, meals, kg
    
    # Carbon impact calculation
    carbon_saved = db.Column(db.Float, default=0.0)  # kg CO2
    energy_saved = db.Column(db.Float, default=0.0)  # kWh
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Notes/description
    notes = db.Column(db.Text, nullable=True)
    
    def __repr__(self):
        return f'<Activity {self.activity_type} - {self.quantity} {self.unit}>'
    
    def to_dict(self):
        """Convert activity to dictionary"""
        return {
            'id': self.id,
            'activity_type': self.activity_type,
            'category': self.category,
            'quantity': self.quantity,
            'unit': self.unit,
            'carbon_saved': self.carbon_saved,
            'energy_saved': self.energy_saved,
            'created_at': self.created_at.isoformat(),
            'notes': self.notes
        }


# Activity type mappings for carbon calculation
ACTIVITY_CONVERSIONS = {
    'Walking': {
        'unit': 'km',
        'carbon_per_unit': 0,  # No carbon saved
        'energy_per_unit': 0,
        'description': 'Walking activity'
    },
    'Cycling': {
        'unit': 'km',
        'carbon_per_unit': 0.21,  # kg CO2 per km (car emission avoided)
        'energy_per_unit': 0,
        'description': 'Cycling activity'
    },
    'Public Transit': {
        'unit': 'km',
        'carbon_per_unit': 0.14,  # kg CO2 per km (car emission avoided)
        'energy_per_unit': 0,
        'description': 'Public transportation'
    },
    'Vegetarian Meal': {
        'unit': 'meals',
        'carbon_per_unit': 2.5,  # kg CO2 per meal (vs meat meal)
        'energy_per_unit': 0,
        'description': 'Vegetarian meal instead of meat'
    },
    'Recycling': {
        'unit': 'kg',
        'carbon_per_unit': 1.5,  # kg CO2 per kg recycled
        'energy_per_unit': 0,
        'description': 'Items recycled'
    },
    'Energy Conservation': {
        'unit': 'kWh',
        'carbon_per_unit': 0.5,  # kg CO2 per kWh saved
        'energy_per_unit': 1,
        'description': 'Energy saved'
    },
    'Water Conservation': {
        'unit': 'liters',
        'carbon_per_unit': 0.0005,  # kg CO2 per liter saved
        'energy_per_unit': 0,
        'description': 'Water saved'
    }
}
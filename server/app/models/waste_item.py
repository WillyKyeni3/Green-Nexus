from server import db
from datetime import datetime

class WasteItem(db.Model):
    __tablename__ = 'waste_items'

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)  # Original filename
    filepath = db.Column(db.String(500), nullable=False)  # Path to stored image
    original_name = db.Column(db.String(255))  # User's original filename
    
    # AI Analysis Results
    waste_type = db.Column(db.String(100))  # e.g., plastic, paper, glass, metal, organic
    recyclability = db.Column(db.String(50))  # e.g., Recyclable, Non-recyclable, Conditionally recyclable
    recycling_instructions = db.Column(db.Text)  # Instructions for proper disposal
    environmental_impact = db.Column(db.Text)  # Environmental impact notes
    material_composition = db.Column(db.Text)  # Materials in the item
    
    # Additional metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Optional: link to user
    
    def __repr__(self):
        return f'<WasteItem {self.filename}>'
    
    def to_dict(self):
        """Convert the WasteItem object to a dictionary for JSON serialization"""
        return {
            'id': self.id,
            'filename': self.filename,
            'filepath': self.filepath,
            'original_name': self.original_name,
            'waste_type': self.waste_type,
            'recyclability': self.recyclability,
            'recycling_instructions': self.recycling_instructions,
            'environmental_impact': self.environmental_impact,
            'material_composition': self.material_composition,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'user_id': self.user_id
        }
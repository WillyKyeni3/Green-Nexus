# server/app/models/user.py
from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(db.Model):
    """
    User model representing a user in the system.
    """
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=True)  # Made nullable to handle both versions
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    green_score = db.Column(db.Float, default=0)
    total_carbon_saved = db.Column(db.Float, default=0)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    activities = db.relationship('Activity', backref='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        """
        Hashes the password and stores the hash.
        """
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """
        Checks if the provided password matches the stored hash.
        """
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'
    
    def to_dict(self):
        """
        Convert user object to dictionary for JSON serialization.
        """
        return {
            'id': self.id,
            'username': self.username,
            'name': self.name,
            'email': self.email,
            'green_score': self.green_score,
            'total_carbon_saved': self.total_carbon_saved,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
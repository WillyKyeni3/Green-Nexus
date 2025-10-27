#server/app/models/user.py
from app import db
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

# db = SQLAlchemy()

class User(db.Model):
    """
    User model representing a user in the system.
    """
    __tablename__ = 'users' # Optional: explicitly name the table

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True) # Index for faster lookups
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

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
        return f'<User {self.email}>'
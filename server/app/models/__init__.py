# server/app/models/__init__.py
# Import all models here so db.create_all() finds them
from .user import User

# If you add more models later, import them here too
# from .other_model import OtherModel

__all__ = ['User'] # Optional: explicitly list what's exported
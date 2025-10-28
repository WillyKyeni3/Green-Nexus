# server/app/models/__init__.py
# Import all models here so db.create_all() finds them
from .user import User
from .activity import Activity

# Try to import optional models
try:
    from .products import Product
except ImportError:
    print("⚠️  Product model not found, skipping...")
    Product = None

try:
    from .waste_item import WasteItem
except ImportError:
    print("⚠️  WasteItem model not found, skipping...")
    WasteItem = None

# If you add more models later, import them here too
# from .other_model import OtherModel

__all__ = ['User', 'Activity', 'Product', 'WasteItem']
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

__all__ = ['User', 'Activity', 'Product', 'WasteItem']
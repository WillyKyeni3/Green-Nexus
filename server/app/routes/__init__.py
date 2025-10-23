# server/app/routes/__init__.py
from .marketplace import get_marketplace_blueprint

# Register all blueprints
def register_blueprints(app):
    app.register_blueprint(get_marketplace_blueprint(), url_prefix='/')
# app/routes/__init__.py
from .auth import auth_bp
from .activities import activities_bp
from .marketplace import marketplace_bp
from .waste_scanner import waste_scanner_bp

def register_blueprints(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(activities_bp)
    app.register_blueprint(marketplace_bp)
    app.register_blueprint(waste_scanner_bp)
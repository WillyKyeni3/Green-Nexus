import os
from app import create_app, db

# Import the models package to ensure all models are registered with db
# from app.models import * # Import all models defined in models/__init__.py

app = create_app() # Create an app instance using your factory

with app.app_context(): #Push an application context
    db.create_all() #Create all tables defined by your models
    print("Database tables created/updated successfully.")
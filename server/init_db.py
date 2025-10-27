# server/init_db.py
import os
from app import create_app, db

app = create_app() # Create an app instance using your factory

with app.app_context(): # Push an application context
    db.create_all() # Create all tables defined by your models
    print("Database tables created successfully.")
# Green Nexus 
https://green-nexus.vercel.app/


Figma: https://www.figma.com/design/vu6iHcDrjEJEIkKlD5IMVF/GreenNexus?node-id=19-3&p=f&t=ksTxgyrggQfil6I2-0

![Project Screenshot](client/public/screenshot.png)

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

Green Nexus is a comprehensive sustainability platform designed to help users track, reduce, and understand their environmental impact. The application provides tools for logging daily activities (like transportation, meals, and purchases) to calculate carbon footprints, a smart waste scanner powered by AI for instant recycling guidance, and personalized insights to promote eco-friendly habits.

## Features

- **Carbon Footprint Tracking:** Log various daily activities and visualize your environmental impact over time.
- **AI-Powered Waste Scanner:** Upload photos of waste items to receive instant analysis on recyclability, material composition, and disposal instructions.
- **Activity Logging:** Track and categorize different types of activities to monitor their environmental impact.
- **Dashboard & Insights:** View your Green Score, weekly activity trends, and receive AI-driven recommendations for improvement.
- **Secure Authentication:** User registration and login functionality for personalized experiences.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS (or your chosen CSS framework)
- **Backend:** Flask (Python)
- **Database:** SQLite (Development) / PostgreSQL (Production)
- **AI Integration:** OpenAI API (GPT-4o for vision tasks)
- **Deployment:** Render (Backend), Vercel/Netlify (Frontend - if applicable)

## Project Structure

```
Green-Nexus/
├── client/ # Next.js frontend application
│ ├── public/
│ ├── src/
│ │ ├── app/ # Pages (Next.js App Router)
│ │ ├── components/ # Reusable UI components
│ │ └── context/ # React Context (e.g., AuthContext)
│ └── package.json
├── server/ # Flask backend application
│ ├── app/
│ │ ├── init.py # Flask app initialization
│ │ ├── models/ # SQLAlchemy models (User, Activity, WasteItem)
│ │ ├── routes/ # API routes (auth, activities, waste_scanner)
│ │ └── services/ # Business logic (e.g., AI analysis)
│ ├── migrations/ # Flask-Migrate files (auto-generated)
│ ├── run.py # Main application entry point
│ ├── requirements.txt # Python dependencies
│ └── .env.example # Example environment variables file
├── uploads/ # Directory for storing uploaded images (backend)
├── .gitignore
├── README.md # This file
└── greennexus.db # SQLite database file (Development)
```


## Prerequisites

- Node.js (v18 or later recommended)
- Python (v3.8 or later recommended)
- pip (Python package installer)
- Git
- An OpenAI API Key

## Installation

### Backend (Flask)

1.  Clone the repository:
    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd Green-Nexus/server
    ```

2.  Create a virtual environment (recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Set up your environment variables (see [Configuration](#configuration)).

5.  Initialize and run database migrations:
    ```bash
    export FLASK_APP=run.py # On Linux/Mac
    # set FLASK_APP=run.py # On Windows Command Prompt
    # $env:FLASK_APP = "run.py" # On Windows PowerShell
    flask db upgrade
    ```

6.  Start the backend server:
    ```bash
    python run.py
    ```
    The backend will typically run on `http://localhost:5000`.

### Frontend (Next.js)

1.  Navigate to the client directory:
    ```bash
    cd Green-Nexus/client
    ```

2.  Install Node.js dependencies:
    ```bash
    npm install
    # OR
    yarn install
    ```

3.  Set up environment variables (see [Configuration](#configuration)).

4.  Start the development server:
    ```bash
    npm run dev
    # OR
    yarn dev
    ```
    The frontend will typically run on `http://localhost:3000`.

## Configuration

### Backend (Flask)

1.  Create a `.env` file in the `server/` directory:
    ```bash
    # server/.env
    OPENAI_API_KEY=your_openai_api_key_here
    # For development with SQLite, DATABASE_URL is optional
    # For production with PostgreSQL, Render sets DATABASE_URL automatically
    # DATABASE_URL=postgresql://user:password@host:port/database_name
    ```

### Frontend (Next.js)

1.  Create a `.env.local` file in the `client/` directory:
    ```bash
    # client/.env.local
    # Adjust the URL if your backend runs on a different port or is deployed
    NEXT_PUBLIC_API_URL=http://localhost:5000
    ```

## Usage

1.  Ensure both the backend and frontend servers are running.
2.  Open your browser and navigate to the frontend URL (e.g., `http://localhost:3000`).
3.  Register or log in to your account.
4.  Use the dashboard to log activities or navigate to the Waste Scanner page to analyze images.
5.  View your environmental impact and insights on the dashboard.

## Deployment

### Backend (to Render)

1.  Push your updated code (including `requirements.txt`, `run.py`, `migrations/`) to your GitHub repository.
2.  Create a new Web Service on Render, connecting it to your GitHub repository.
3.  Set the Root Directory to `server`.
4.  Set the Build Command to `pip install -r requirements.txt`.
5.  Set the Start Command to `gunicorn -w 4 -b $PORT run:app`.
6.  Add the `OPENAI_API_KEY` as an environment variable in Render.
7.  Create a PostgreSQL database instance on Render and attach it to your Web Service (this automatically sets `DATABASE_URL`).
8.  After the initial deployment, run `flask db upgrade` within the Render environment to initialize the database schema.

### Frontend (to Vercel/Netlify)

Deployment steps will vary depending on the platform chosen for the frontend. Ensure the `NEXT_PUBLIC_API_URL` environment variable points to your deployed backend URL.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in an existing user
- `POST /api/auth/logout` - Log out the current user

### Activities
- `GET /api/activities/types` - Get available activity types
- `GET /api/activities/<user_id>` - Get activities for a specific user
- `GET /api/activities/<user_id>/<activity_id>` - Get a specific activity
- `POST /api/activities/log` - Log a new activity
- `PUT /api/activities/<user_id>/<activity_id>` - Update an existing activity
- `DELETE /api/activities/<user_id>/<activity_id>` - Delete an activity
- `GET /api/activities/weekly-stats/<user_id>` - Get weekly statistics for a user

### Waste Scanner
- `POST /api/waste-scanner/upload` - Upload an image for analysis
- `GET /api/waste-scanner/recent` - Get the 6 most recently scanned items
- `GET /api/waste-scanner/results` - Get all analysis results
- `GET /api/waste-scanner/results/<id>` - Get a specific analysis result

## Database Schema

### `users`
- `id` (Integer, Primary Key, Auto-increment)
- `username` (String, Unique)
- `email` (String, Unique)
- `password_hash` (String)
- `green_score` (Float, Default 0.0)

### `activities`
- `id` (Integer, Primary Key, Auto-increment)
- `user_id` (Integer, Foreign Key -> users.id)
- `activity_type` (String)
- `quantity` (Float)
- `unit` (String)
- `carbon_saved` (Float)
- `category` (String)
- `notes` (Text, Nullable)
- `created_at` (DateTime, Default now)

### `waste_items`
- `id` (Integer, Primary Key, Auto-increment)
- `filename` (String) - Securely generated filename
- `filepath` (String) - Path to stored image
- `original_name` (String, Nullable) - Original filename
- `waste_type` (String, Nullable)
- `recyclability` (String, Nullable) - e.g., Recyclable, Non-recyclable
- `recycling_instructions` (Text, Nullable)
- `environmental_impact` (Text, Nullable)
- `material_composition` (Text, Nullable)
- `created_at` (DateTime, Default now)
- `user_id` (Integer, Foreign Key -> users.id, Nullable)

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) (if you create one) for guidelines on how to proceed.

## Contributors

We would like to thank the following individuals for their contributions to the Green Nexus project:

- **Willy Kyeni** - [Willykyeni@gmail.com](mailto:Willykyeni@gmail.com) - Full Stack Developer, User Authentication, Waste-Scanner page
- **Github link** -  https://github.com/WillyKyeni3
- **Terry Yegon** - [yegonterry618@gmail.com](mailto:yegonterry618@gmail.com) - Full Stack Developer, Dashboard, user Profile
- **Github link** -  https://github.com/TerryYegon
- **Shelton Juma** - [shamolashelton@gmail.com](mailto:shamolashelton@gmail.com) - Full Stack Developer, Activity Page, Ai Marketplace
- **Github link** -  https://github.com/Shamola-Shelton

## License

This project is licensed under the [MIT License](./LICENSE).

## Contact

- **Willy Kyeni** - [Willykyeni@gmail.com](mailto:Willykyeni@gmail.com)

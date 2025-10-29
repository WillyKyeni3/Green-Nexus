# Render Deployment Setup

## Critical Issue: Database Configuration

Your backend is currently failing because **the DATABASE_URL environment variable is not set** on Render.

### Error You're Seeing
```
sqlalchemy.exc.OperationalError: (sqlite3.OperationalError) unable to open database file
```

This happens because:
1. Render doesn't have a PostgreSQL database connected
2. The app tries to fall back to SQLite
3. SQLite doesn't work on Render's ephemeral filesystem

## Solution: Add PostgreSQL Database

### Option 1: Create a New PostgreSQL Database on Render

1. Go to your Render Dashboard: https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure the database:
   - **Name**: `green-nexus-db` (or any name you prefer)
   - **Database**: `greennexus`
   - **User**: (auto-generated)
   - **Region**: Same as your web service
   - **Plan**: Free tier is fine for testing
4. Click **"Create Database"**
5. Wait for the database to be created (takes ~2 minutes)

### Option 2: Use an Existing PostgreSQL Database

If you already have a PostgreSQL database (on Render, Supabase, Neon, etc.):

1. Get the connection string (should look like):
   ```
   postgresql://user:password@host:5432/database
   ```

### Connect Database to Your Web Service

1. Go to your **Web Service** on Render
2. Click **"Environment"** in the left sidebar
3. Add a new environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: 
     - If using Render PostgreSQL: Click "Add from Database" and select your database
     - If using external database: Paste your connection string
4. Click **"Save Changes"**
5. Render will automatically redeploy your service

### Verify Setup

After redeployment:
1. Check the logs for successful database connection
2. You should see: `Registering API Blueprints...`
3. Try registration again at: https://green-nexus.vercel.app/login

## Other Required Environment Variables

Make sure these are also set in your Render environment:

- `SECRET_KEY`: A random secret key for Flask sessions
- `JWT_SECRET_KEY`: A random secret key for JWT tokens
- `FLASK_CONFIG`: Set to `production`

You can generate random keys with:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

## Database Migrations

The `build.sh` script automatically runs migrations during deployment:
```bash
flask db upgrade
```

If you need to run migrations manually:
1. Go to your web service shell (if available)
2. Run: `flask db upgrade`

## Troubleshooting

### Still getting 500 errors?
1. Check Render logs for the actual error
2. Verify `DATABASE_URL` is set correctly
3. Make sure the database is in the same region as your web service
4. Check that the database is running and accessible

### Migration errors?
If you see migration errors, you may need to:
1. Delete the `migrations` folder
2. Reinitialize migrations:
   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

### Connection timeout?
- Ensure your database allows connections from Render's IP ranges
- Check if the database is in the same region as your web service

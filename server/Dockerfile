# server/Dockerfile
FROM python:3.11-slim

# Install system deps
RUN apt-get update && apt-get install -y \
    libpq-dev gcc libjpeg-dev zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements + install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy full app
COPY . .

# Run Gunicorn on Render's $PORT
CMD ["sh", "-c", "gunicorn run:app --bind 0.0.0.0:$PORT --workers 1 --timeout 60"]

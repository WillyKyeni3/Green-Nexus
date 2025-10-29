#!/usr/bin/env bash
set -o errexit

# System deps for Pillow & psycopg2
apt-get update -qq
apt-get install -y --no-install-recommends \
    libjpeg-dev \
    zlib1g-dev \
    libpq-dev \
    gcc \
    python3-dev

pip install --upgrade pip
pip install -r requirements.txt

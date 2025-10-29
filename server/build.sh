#!/usr/bin/env bash
# exit on error
set -o errexit

# Install system dependencies for Pillow
apt-get update
apt-get install -y libjpeg-dev zlib1g-dev

# Upgrade pip and install Python packages
pip install --upgrade pip
pip install -r requirements.txt
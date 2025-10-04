#!/bin/bash
# Deployment script for Downloads Orchestrator

echo "Starting deployment..."

# Activate venv
source venv/bin/activate

# Run tests
pytest test_orchestrator.py

# Build Docker (if daemon running)
# docker build -t orchestrator .

# Start services
python offline_automator.py &
python web_orchestrator.py

echo "Deployment complete. Access at http://127.0.0.1:5000"
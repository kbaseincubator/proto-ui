#!/bin/sh

# Script to start the web server

set -e

export PYTHONPATH=/app
python /app/src/server.py

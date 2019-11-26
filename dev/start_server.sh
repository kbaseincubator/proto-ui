#!/bin/sh

# Start the development servers

set -e

export DEVELOPMENT=1
docker-compose up --build

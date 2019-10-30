#!/bin/sh

# Start the development servers

set -e

yarn run watch &
docker-compose up --build

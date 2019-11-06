#!/bin/sh

# Start the development servers

set -e

export DEVELOPMENT=1
yarn run watch &
docker-compose up --build

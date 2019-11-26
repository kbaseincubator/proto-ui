# For installing npm dependencies and building static css/js
FROM node:10-alpine
COPY ./webpack.config.js ./tsconfig.json ./package.json yarn.lock /app/
COPY src/client /app/src/client
COPY src/static /app/src/static
WORKDIR /app

# Install npm dependencies and build static css/js
ENV PRODUCTION=true
RUN yarn run build && rm -rf node_modules

# Set up python
FROM python:3.7-alpine
COPY src /app/src
COPY requirements.txt /app
WORKDIR /app

# apk dependencies below are needed for building sanic/uvloop
RUN apk --update add --virtual build-dependencies python-dev build-base && \
    pip install --upgrade pip && \
    pip install --upgrade --no-cache-dir -r requirements.txt && \
    apk del build-dependencies

ENV PYTHONPATH=/app
CMD ["python", "/app/src/server.py"]

FROM python:3.7-alpine

# Install pip dependencies
ARG DEVELOPMENT
WORKDIR /app/
COPY requirements.txt dev-requirements.txt /app/
# apk dependencies below are needed for installing gevent
RUN apk --update add --virtual build-dependencies python-dev build-base && \
    pip install --upgrade pip && \
    pip install --upgrade --no-cache-dir -r requirements.txt && \
    if [ "$DEVELOPMENT" ]; then pip install --no-cache-dir -r dev-requirements.txt; fi && \
    apk del build-dependencies

CMD ["sh", "scripts/start_server.sh"]

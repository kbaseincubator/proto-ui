# KBase React + Python UI

* React
* Webpack
* Tachyons
* Flask and jinja2
* Gunicorn & gevent

## Development

Install `docker` and `docker-compose` first.

**Start the server** with `make serve`. On the very first run, it will take a few minutes to install the npm and pip dependencies. Point your browser to **`localhost:5000`**.

## Troubleshooting

If a docker server crashes, or if you install a new npm package, run:
* `docker-compose restart web` to restart the flask server
* `docker-compose restart node` to restart the node server

Run `make reset` to do a hard reset of your docker build, deleting containers and volumes.

# KBase Prototype React + Python UI

* React
* Webpack
* Tachyons
* Sanic with jinja2

## Development

### Prerequisites

1. Install docker: https://docs.docker.com/install/
1. Install docker-compose: https://docs.docker.com/compose/install/
1. Install Node 10: https://github.com/nvm-sh/nvm
1. Install yarn: https://yarnpkg.com/en/docs/install

### Run the server

Install `docker` and `docker-compose` first.

**Start the server** with `make serve`. On the very first run, it will take a few minutes to install the npm and pip dependencies. Point your browser to **`localhost:5000`**.

### Troubleshooting

If a docker server crashes, or if you install a new npm package, run `make reset`.
* `docker-compose restart web` to restart the flask server
* `docker-compose restart node` to restart the node server

Run `make reset` to do a hard reset of your docker build, deleting containers and volumes.

## Dockerfiles

There are a few dockerfiles:

* `Dockerfile` - prod image
* `dev/Dockerfile-python` - development python image
* `dev/Dockerfile-node` - development js/css watcher
* `docker-compose.yaml` - development docker-compose config

## Deployment

### Build image

To build locally, first increment the semantic version in `scripts/local-build.sh` and then run it.

### Environment config

These environment variables can be set:

- `URL_PREFIX` - path prefix for all links and asset urls (css, js, images) that get generated in the app. Used when behind an nginx proxy.

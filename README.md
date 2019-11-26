# KBase Prototype React + Python UI

* React
* Webpack
* Typescript
* Tachyons
* Backend: Sanic and jinja2

## Development

### Prerequisites

1. Install docker: https://docs.docker.com/install/
1. Install docker-compose: https://docs.docker.com/compose/install/
1. Install Node 10: https://github.com/nvm-sh/nvm
1. Install yarn: https://yarnpkg.com/en/docs/install

### Run the server

In one terminal, run `make serve` to start the python server.

In another terminal, run `yarn run watch` to start the bundler.

### Linting and formatting typescript

Run `yarn test` to lint your code, and `yarn run fix` to auto-format your code.

### Troubleshooting

Run `make reset` to do a hard reset of your docker build, deleting containers and volumes.

## Dockerfiles

There are a few dockerfiles:

* `Dockerfile` - production image
* `dev/Dockerfile-python` - development python image
* `dev/Dockerfile-node` - development js/css watcher
* `docker-compose.yaml` - development docker-compose config

## Deployment

### Build image

To build locally, first increment the semantic version in `scripts/local-build.sh` and then run that script.

### Environment variables

These environment variables can be set:

- `URL_PREFIX` - path prefix for all links and asset urls (css, js, images) that get generated in the app. Used when behind an nginx proxy.

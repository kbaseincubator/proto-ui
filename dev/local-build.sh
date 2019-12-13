#!/bin/sh
set -e
# show the commands we execute
set -o xtrace
export IMAGE_NAME="kbase/proto-ui:0.7.1"
sh hooks/build
docker push $IMAGE_NAME

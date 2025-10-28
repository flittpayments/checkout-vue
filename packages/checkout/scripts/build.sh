#!/bin/bash

gulp $@ && vue-cli-service build --no-module $@

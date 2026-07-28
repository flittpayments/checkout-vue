#!/bin/bash

mkdir -p certs

if command -v mkcert >/dev/null 2>&1; then
  mkcert -install
  mkcert -cert-file ./certs/cert.pem -key-file ./certs/key.pem localhost 127.0.0.1 ::1
  echo "Certificates generated in ./certs/"
else
  echo "Error: mkcert is not installed. Please install it first (https://github.com/FiloSottile/mkcert)."
  exit 1
fi

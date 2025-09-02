#!/usr/bin/env bash

echo "Bundle android regtest"

cd android

echo "Bundle regtest release"
NODE_ENV=sandbox ./gradlew bundleRelease
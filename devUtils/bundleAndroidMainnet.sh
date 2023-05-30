#!/usr/bin/env bash

echo "Bundle android mainnet"

cd android

echo "Bundle mainnet release"
NODE_ENV=production ./gradlew bundleRelease
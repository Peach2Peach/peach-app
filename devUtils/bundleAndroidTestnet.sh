#!/usr/bin/env bash

echo "Bundle android testnet"

cd android

echo "Bundle testnet release"
NODE_ENV=development ./gradlew bundleRelease
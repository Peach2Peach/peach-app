#!/usr/bin/env bash

echo "Build iOS Testnet"

NODE_ENV=development react-native bundle --reset-cache --platform ios --entry-file index.ts --dev true --bundle-output ios/main.jsbundle --assets-dest ios

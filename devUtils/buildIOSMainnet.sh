#!/usr/bin/env bash

echo "Build iOS Mainnet"

cp .env.mainnet .env.production

NODE_ENV=production react-native bundle --reset-cache --platform ios --entry-file index.js --dev false --bundle-output ios/main.jsbundle --assets-dest ios

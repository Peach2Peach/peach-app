#!/usr/bin/env bash

echo "Build android testnet"

cp .env.testnet .env.production

react-native bundle --reset-cache --platform android --dev true --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle
cd android

echo "Clean build"
./gradlew clean

echo "Start build"
NODE_ENV=development ./gradlew assembleQaDebug
echo "Finished build"

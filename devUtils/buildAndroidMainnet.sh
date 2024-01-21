#!/usr/bin/env bash

echo "Build android mainnet"

react-native bundle --reset-cache --platform android --dev false --entry-file index.ts --bundle-output android/app/src/main/assets/index.android.bundle
cd android

echo "Clean build"
./gradlew clean

echo "Start build"
NODE_ENV=production ./gradlew assembleProdRelease
echo "Finished build"

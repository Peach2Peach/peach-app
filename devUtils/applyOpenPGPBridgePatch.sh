#!/bin/sh
# Overwrites the upstream OpenPGPBridge.xcframework shipped by
# react-native-fast-openpgp with the locally-rebuilt one in
# patches/openpgp-bridge/. The local build is produced from the
# openpgp-mobile fork with the ARM64 IndexByte MTE-safety patch.
#
# Run automatically by `postinstall`. Idempotent.

set -e

SRC="patches/openpgp-bridge/OpenPGPBridge.xcframework"
DST="node_modules/react-native-fast-openpgp/ios/OpenPGPBridge.xcframework"

if [ ! -d "$SRC" ]; then
  echo "applyOpenPGPBridgePatch: $SRC missing; skipping."
  exit 0
fi

if [ ! -d "node_modules/react-native-fast-openpgp/ios" ]; then
  echo "applyOpenPGPBridgePatch: react-native-fast-openpgp not installed; skipping."
  exit 0
fi

rm -rf "$DST"
cp -R "$SRC" "$DST"
echo "applyOpenPGPBridgePatch: replaced OpenPGPBridge.xcframework in node_modules."

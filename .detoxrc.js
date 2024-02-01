/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    $0: "jest",
    ars: {
      config: "./tests/e2e/jest.config.js",
      _: ["e2e"],
    },
  },
  jest: {
    setupTimeout: 120000,
    reportSpecs: false,
    reportWorkerAssign: false,
  },
  apps: {
    "ios.debug": {
      type: "ios.app",
      binaryPath:
        "ios/build/Build/Products/Debug-iphonesimulator/Peach Bitcoin Testnet.app",
      build:
        "xcodebuild -workspace ios/peach.xcworkspace -scheme peach -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
    },
    "android.debug": {
      type: "android.apk",
      binaryPath:
        "android/app/build/outputs/apk/qa/debug/app-qa-universal-debug.apk",
      testBinaryPath:
        "android/app/build/outputs/apk/androidTest/qa/debug/app-qa-debug-androidTest.apk",
      build:
        "cd android && ./gradlew assembleQaRelease assembleAndroidTest -DtestBuildType=debug",
    },
  },
  devices: {
    "ios.simulator": {
      type: "ios.simulator",
      device: {
        type: "iPhone 14",
      },
    },
    "android.debug": {
      type: "android.attached",
      device: {
        adbName: ".*",
      },
    },
  },
  configurations: {
    ios: {
      device: "ios.simulator",
      app: "ios.debug",
    },
    android: {
      device: "android.debug",
      app: "android.debug",
    },
  },
};

/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    $0: 'jest',
    ars: {
      config: './tests/e2e/jest.config.js',
      _: ['e2e']
    }
  },
  jest: {
    setupTimeout: 120000,
    reportSpecs: false,
    reportWorkerAssign: false,
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/Peach Bitcoin Testnet.app',
      build: 'xcodebuild -workspace ios/peach.xcworkspace -scheme peach -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'SPECIFY_PATH_TO_YOUR_APP_BINARY'
    }
  },
  devices: {
    'ios.simulator': {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 14'
      }
    },
    'android.emulator': {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_3a_API_30_x86'
      }
    }
  },
  configurations: {
    ios: {
      device: 'ios.simulator',
      app: 'ios.debug'
    },
    android: {
      device: 'android.emulator',
      app: 'android.debug'
    }
  }
}

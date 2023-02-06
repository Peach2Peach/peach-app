/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    $0: 'jest',
    ars: {
      config: './test/e2e/jest.config.js',
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
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/peach.app',
      build: 'xcodebuild -workspace ios/peach.xcworkspace -configuration Debug -scheme peach -sdk iphonesimulator -derivedDataPath ios/build'

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

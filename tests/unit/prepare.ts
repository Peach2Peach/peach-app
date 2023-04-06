jest.mock('../../src/utils/peachAPI', () => ({
  ...jest.requireActual('../../src/utils/peachAPI'),
  ...jest.requireActual('../../src/utils/__mocks__/peachAPI'),
}))
jest.mock('../../src/utils/wallet/PeachWallet', () => ({
  ...jest.requireActual('../../src/utils/__mocks__/wallet/PeachWallet'),
}))
jest.mock('../../src/utils/log')

jest.mock('react-native-share', () => ({
  open: jest.fn(),
}))

jest.mock('react-native-randombytes', () => ({
  randomBytes: jest.fn((size, callback) => {
    let uint8 = new Uint8Array(size)
    uint8 = uint8.map(() => Math.floor(Math.random() * 90) + 10)
    callback(null, uint8)
  }),
}))

jest.mock('react-native-crypto-js', () => ({
  AES: {
    encrypt: (str: string) => str,
    decrypt: (str: string) => str,
  },
  enc: {
    Utf8: 'utf-8',
  },
}))

export const requestPermissionMock = jest.fn()
export const hasPermissionMock = jest.fn()
jest.mock('@react-native-firebase/messaging', () => {
  const messaging = () => ({
    requestPermission: requestPermissionMock,
    hasPermission: hasPermissionMock,
    onMessage: jest.fn(),
    onNotificationOpenedApp: jest.fn(),
  })

  messaging.AuthorizationStatus = {
    NOT_DETERMINED: -1,
    AUTHORIZED: 1,
    DENIED: 0,
    PROVISIONAL: 2,
  }
  return messaging
})

export const deleteUnsentReportsMock = jest.fn()
export const logMock = jest.fn()
export const recordErrorMock = jest.fn()
jest.mock('@react-native-firebase/crashlytics', () => () => ({
  deleteUnsentReports: deleteUnsentReportsMock,
  log: logMock,
  recordError: recordErrorMock,
}))

jest.mock('@react-native-firebase/analytics', () => () => ({
  logAppOpen: jest.fn(),
  logScreenView: jest.fn(),
  setAnalyticsCollectionEnabled: jest.fn(),
  logEvent: jest.fn(),
}))

jest.mock('react-native-device-info', () => ({
  getBuildNumber: jest.fn(),
  getUniqueId: () => 'UNIQUE-DEVICE-ID',
  getUniqueIdSync: () => 'UNIQUE-DEVICE-ID',
  getVersion: () => '0.2.0',
  isAirplaneModeSync: jest.fn(),
  isEmulatorSync: () => true,
}))
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('react-native-webview')
jest.mock('react-native-permissions', () => ({
  checkNotifications: jest.fn(),
}))
jest.mock('../../src/components/camera/CustomQRCodeScanner', () => ({
  CustomQRCodeScanner: () => null,
}))
jest.mock('react-native-promise-rejection-utils', () => ({
  setUnhandledPromiseRejectionTracker: jest.fn(),
}))

type Storage = {
  [key: string]: any
}
export let storage: Record<string, Storage> = {}
export const setStorage = (strg: Storage) => (storage = strg)
export const resetStorage = () =>
  Object.keys(storage).forEach((key) => {
    storage[key] = {}
  })

jest.mock('react-native-mmkv-storage', () => ({
  IOSAccessibleStates: {},
  MMKVLoader: jest.fn(() => ({
    setAccessibleIOS: () => ({
      withEncryption: () => ({
        withInstanceID: (instanceId: string) => ({
          initialize: () => {
            storage[instanceId] = {}

            const get = (key: string) => storage[instanceId][key]
            const getAsync = async (key: string) => storage[instanceId][key]
            const store = (key: string, val: any) => (storage[instanceId][key] = val)
            const storeAsync = async (key: string, val: any) => (storage[instanceId][key] = val)
            const remove = (key: string) => delete storage[instanceId][key]

            return {
              clearStore: jest.fn().mockImplementation(() => (storage[instanceId] = {})),
              setItem: jest.fn().mockImplementation(storeAsync),
              getItem: jest.fn().mockImplementation(getAsync),
              removeItem: jest.fn().mockImplementation(remove),
              getString: jest.fn().mockImplementation(get),
              setString: jest.fn().mockImplementation(store),
              setStringAsync: jest.fn().mockImplementation(storeAsync),
              getArray: jest.fn().mockImplementation(get),
              setArray: jest.fn().mockImplementation(store),
              setArrayAsync: jest.fn().mockImplementation(storeAsync),
              setMap: jest.fn().mockImplementation(store),
              setMapAsync: jest.fn().mockImplementation(storeAsync),
              getMap: jest.fn().mockImplementation(get),
              getBool: jest.fn().mockImplementation(get),
              setBool: jest.fn().mockImplementation(store),
              getBoolAsync: jest.fn().mockImplementation(getAsync),
              indexer: {
                getKeys: jest.fn().mockImplementation(async () => Object.keys(storage[instanceId])),
                maps: {
                  getAll: jest.fn().mockImplementation(async () =>
                    Object.keys(storage[instanceId]).reduce((obj, key, i) => {
                      obj[String(i)] = [key, storage[instanceId][key]]
                      return obj
                    }, {} as AnyObject),
                  ),
                },
              },
              options: {
                accessibleMode: 'AccessibleAfterFirstUnlock',
              },
            }
          },
        }),
      }),
    }),
  })),
}))

jest.mock('bdk-rn')

jest.mock('react-native-snap-carousel', () => jest.fn())
jest.mock('react-native-url-polyfill/auto', () => jest.fn())
jest.mock('@react-native-clipboard/clipboard', () => jest.fn())
jest.mock('@env', () => ({
  NETWORK: 'regtest',
  DEV: 'true',
  API_URL: 'https://localhost:8080/',
  BLOCKEXPLORER: 'https://localhost:3000/',
}))

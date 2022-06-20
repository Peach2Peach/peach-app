export {}

import * as accountData from './data/accountData'

jest.mock('../src/utils/peachAPI', () => {
  const actual = jest.requireActual('../src/utils//peachAPI')
  const mock = jest.requireActual('../src/utils/__mocks__/peachAPI')
  return {
    ...actual,
    ...mock
  }
})

jest.mock('react-native-screens', () => {
  const actual = jest.requireActual('react-native-screens')
  return {
    ...actual,
    enableScreens: jest.fn()
  }
})

jest.mock('react-native-fast-openpgp', () => {
  const actual = jest.requireActual('react-native-fast-openpgp')
  return {
    ...actual,
    generate: () => accountData.account1.pgp
  }
})

jest.mock('react-native-share', () => ({
  open: jest.fn()
}))

jest.mock('react-native-randombytes', () => ({
  randomBytes: jest.fn((size, callback) => {
    let uint8 = new Uint8Array(size)
    uint8 = uint8.map(() => Math.floor(Math.random() * 90) + 10)
    callback(null, uint8)
  })
}))

jest.mock('react-native-crypto-js', () => ({
  AES: {
    encrypt: (str: string) => str,
    decrypt: (str: string) => str,
  },
  enc: {
    Utf8: 'utf-8'
  }
}))

jest.mock('@react-native-firebase/messaging', () => () => ({
  onMessage: jest.fn(),
  onNotificationOpenedApp: jest.fn(),
}))
jest.mock('@react-native-firebase/crashlytics', () => () => ({
  log: jest.fn(),
}))
jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(),
  getBuildNumber: jest.fn(),
  getUniqueId: jest.fn(),
}))
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('react-native-canvas')
jest.mock('react-native-webview')
jest.mock('react-native-permissions', () => ({
  checkNotifications: jest.fn()
}))
jest.mock('react-native-qrcode-scanner', () => jest.fn())
jest.mock('react-native-promise-rejection-utils', () => ({
  setUnhandledPromiseRejectionTracker: jest.fn()
}))

type Storage = {
  [key: string]: string
}
const storage: Storage = {
}
jest.mock('react-native-encrypted-storage', () => ({
  getItem: async (key: string, val: string) => storage[key] = val,
  setItem: async (key: string) => storage[key],
}))

jest.mock('react-native-snap-carousel', () => jest.fn())
jest.mock('react-native-url-polyfill/auto', () => jest.fn())
jest.mock('@react-native-clipboard/clipboard', () => jest.fn())
jest.mock('@env', () => ({
  NETWORK: 'regtest',
  DEV: 'true',
  API_URL: 'https://localhost:8080/',
  HTTP_AUTH_USER: 'value',
  HTTP_AUTH_PASS: 'value2'
}))

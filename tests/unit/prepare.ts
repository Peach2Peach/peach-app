import { mockBDKRN } from './mocks/bdkRN'

const CookieManagerMock = jest.fn()
jest.mock('@react-native-cookies/cookies', () => ({ set: (...args: unknown[]) => CookieManagerMock(...args) }))

const WebViewMock = jest.fn()
jest.mock('react-native-webview', () => ({
  WebView: (...args: unknown[]) => WebViewMock(...args),
}))

jest.mock('../../src/utils/peachAPI', () => ({
  ...jest.requireActual('../../src/utils/__mocks__/peachAPI'),
}))
jest.mock('../../src/utils/wallet/PeachWallet')
jest.mock('../../src/utils/log')

jest.mock('../../src/utils/system/getDeviceLocale', () => ({
  getDeviceLocale: () => 'en',
}))

mockBDKRN()
export {}

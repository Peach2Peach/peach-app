import { getDeviceLocale } from './getDeviceLocale'

jest.mock('react-native', () => ({
  NativeModules: {
    SettingsManager: {
      settings: {
        AppleLocale: 'fr_FR',
        AppleLanguages: ['fr_FR'],
      },
    },
    I18nManager: {
      localeIdentifier: 'de',
    },
  },
}))
const isIOSMock = jest.fn()
jest.mock('./isIOS', () => ({
  isIOS: () => isIOSMock(),
}))

jest.mock('./getDeviceLocale', () => ({
  ...jest.requireActual('./getDeviceLocale'),
}))

describe('getDeviceLocale', () => {
  it('checks whether app is running on android', () => {
    isIOSMock.mockReturnValue(false)
    expect(getDeviceLocale()).toBe('de')
  })
  it('checks whether app is running on ios', () => {
    isIOSMock.mockReturnValue(true)
    expect(getDeviceLocale()).toBe('fr_FR')
  })
})

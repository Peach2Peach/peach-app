import { Linking } from 'react-native'
import { getInstallerPackageNameSync } from 'react-native-device-info'
import { linkToAppStoreAndroid } from '.'

jest.mock('react-native-device-info', () => ({
  getBundleId: jest.fn().mockReturnValue('com.example.bundleId'),
  getInstallerPackageNameSync: jest.fn(),
}))

describe('linkToAppStoreAndroid', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('opens the correct URL when installed from Google Play', async () => {
    ;(<jest.Mock>getInstallerPackageNameSync).mockReturnValueOnce('com.android.vending')
    await linkToAppStoreAndroid()
    expect(Linking.openURL).toHaveBeenCalledWith('https://play.google.com/store/apps/details?id=com.example.bundleId')
  })

  it('opens the correct URL when not installed via APK', async () => {
    ;(<jest.Mock>getInstallerPackageNameSync).mockReturnValueOnce('com.example.installer')
    await linkToAppStoreAndroid()
    expect(Linking.openURL).toHaveBeenCalledWith('https://peachbitcoin.com/beta')
  })
})

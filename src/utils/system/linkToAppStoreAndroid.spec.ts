import { Linking } from 'react-native'
import { linkToAppStoreAndroid } from '.'

describe('linkToAppStoreAndroid', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  const getInstallerPackageNameSync = jest.spyOn(require('react-native-device-info'), 'getInstallerPackageNameSync')

  it('opens the correct URL when installed from Google Play', async () => {
    getInstallerPackageNameSync.mockReturnValueOnce('com.android.vending')
    await linkToAppStoreAndroid()
    expect(Linking.openURL).toHaveBeenCalledWith('https://play.google.com/store/apps/details?id=com.example.bundleId')
  })

  it('opens the correct URL when not installed via APK', async () => {
    getInstallerPackageNameSync.mockReturnValueOnce('com.example.installer')
    await linkToAppStoreAndroid()
    expect(Linking.openURL).toHaveBeenCalledWith('https://peachbitcoin.com/apk/')
  })
})

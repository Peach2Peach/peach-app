import { NETWORK } from '@env'
import { Linking } from 'react-native'
import { getBundleId, getInstallerPackageNameSync } from 'react-native-device-info'
import { isAndroid } from './isAndroid'
import { isIOS } from './isIOS'

/**
 * @description Method to open app page info in appstore
 */
export const linkToAppStore = async () => {
  const bundleId = getBundleId()
  if (isIOS() && (await Linking.canOpenURL('itms-beta://'))) {
    const appId = NETWORK === 'bitcoin' ? '1628578161' : '1619331312'
    Linking.openURL(`https://beta.itunes.apple.com/v1/app/${appId}`)
    // for mainnet: Linking.openURL(`itms-apps://itunes.apple.com/us/app/apple-store/${bundleId}?mt=8`)
  } else if (isAndroid()) {
    const isInstalledByGooglePlay = getInstallerPackageNameSync() === 'com.android.vending'
    Linking.openURL(
      isInstalledByGooglePlay
        ? `https://play.google.com/store/apps/details?id=${bundleId}`
        : 'https://peachbitcoin.com/apks/latest/app-prod-universal-release.apk',
    )
  }
}

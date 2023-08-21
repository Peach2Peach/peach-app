import { Linking } from 'react-native'
import { getBundleId, getInstallerPackageNameSync } from 'react-native-device-info'
import { languageState } from '../i18n'
import { getLocalizedLink } from '../web'

export const linkToAppStoreAndroid = () => {
  const bundleId = getBundleId()
  const isInstalledByGooglePlay = getInstallerPackageNameSync() === 'com.android.vending'
  Linking.openURL(
    isInstalledByGooglePlay
      ? `https://play.google.com/store/apps/details?id=${bundleId}`
      : getLocalizedLink('apk', languageState.locale),
  )
}

import { getBundleId, getInstallerPackageNameSync } from 'react-native-device-info'
import { languageState } from '../i18n'
import { getLocalizedLink } from '../web'
import { openURL } from '../web/openURL'

export const linkToAppStoreAndroid = () => {
  const bundleId = getBundleId()
  const isInstalledByGooglePlay = getInstallerPackageNameSync() === 'com.android.vending'
  return openURL(
    isInstalledByGooglePlay
      ? `https://play.google.com/store/apps/details?id=${bundleId}`
      : getLocalizedLink('apk', languageState.locale),
  )
}

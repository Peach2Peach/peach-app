import { Linking } from 'react-native'

/**
 * @description Method to open app either through application specific url or fallback
 * @param appLink application specific link (e.g. paypal://)
 * @param fallbackUrl web url as fallback, OS can read following urls for more information
 * Android: https://domain.com/.well-known/assetlinks.json
 * iOS: https://domain.com/.well-known/apple-app-site-association
 */
export const openAppLink = async (fallbackUrl: string, appLink?: string) => {
  if (appLink && (await Linking.canOpenURL(appLink))) {
    await Linking.openURL(appLink)
  }
  await Linking.openURL(fallbackUrl)
}

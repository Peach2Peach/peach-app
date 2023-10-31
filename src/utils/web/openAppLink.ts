import { Linking } from 'react-native'
import { openURL } from './openURL'

/**
 * @description Method to open app either through application specific url or fallback
 * Android: https://domain.com/.well-known/assetlinks.json
 * iOS: https://domain.com/.well-known/apple-app-site-association
 */
export const openAppLink = async (fallbackUrl: string, appLink?: string) => {
  if (appLink && (await Linking.canOpenURL(appLink))) return openURL(appLink)
  return openURL(fallbackUrl)
}

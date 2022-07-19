import { Linking } from "react-native"

interface download {
  (filename: string, text:string): void
}

/**
 * @description Method to trigger download on web
 * @param filename name of file
 * @param text file content
 */
export const download: download = (filename, text) => {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

/**
 * @description Method to open app either through application specific url or fallback
 * @param appLink application specific link (e.g. paypal://)
 * @param fallbackUrl web url as fallback, OS can read following urls for more information
 * Android: https://domain.com/.well-known/assetlinks.json
 * iOS: https://domain.com/.well-known/apple-app-site-association
 */
export const openAppLink = async (fallbackUrl: string, appLink?: string) => {
  if (appLink && await Linking.canOpenURL(appLink)) {
    await Linking.openURL(appLink)
  }
  await Linking.openURL(fallbackUrl)
}
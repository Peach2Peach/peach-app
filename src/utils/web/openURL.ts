import { Linking } from 'react-native'

export const openURL = async (url: string) => {
  if (await Linking.canOpenURL(url)) return Linking.openURL(url)

  return undefined
}

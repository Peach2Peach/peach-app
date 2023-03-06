import { Linking } from 'react-native'

export const goToHomepage = async () => {
  await Linking.openURL('https://peachbitcoin.com')
}

import { NETWORK } from '@env'
import { Linking } from 'react-native'

export const linkToAppStoreIOS = async () => {
  if (await Linking.canOpenURL('itms-beta://')) {
    const appId = NETWORK === 'bitcoin' ? '1628578161' : '1619331312'
    Linking.openURL(`https://beta.itunes.apple.com/v1/app/${appId}`)
    // for mainnet: Linking.openURL(`itms-apps://itunes.apple.com/us/app/apple-store/${bundleId}?mt=8`)
  }
}

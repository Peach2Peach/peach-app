import React, { ReactElement } from 'react'
import { Linking, View } from 'react-native'
import { Headline, Icon, PrimaryButton, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { isAndroid, isIOS } from '../../../utils/system'

const linkToMobileWallet = () => {
  if (isIOS()) {
    Linking.openURL('itms-apps://apps.apple.com/us/app/muun-wallet/id1482037683')
  } else if (isAndroid()) {
    Linking.openURL('market://details?id=io.muun.apollo')
  }
}
const linkToBitbox = () => Linking.openURL('https://shiftcrypto.ch/bitbox02/?ref=DLX6l9ccCc')

export default (): ReactElement => (
  <View style={tw`mb-12`}>
    <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl`}>
      {i18n('iDontHaveAWallet.title')}
    </Headline>
    <Text style={tw`text-center text-white-1 mt-3`}>{i18n('iDontHaveAWallet.mobileWallet')}</Text>
    <PrimaryButton style={tw`flex items-center mt-8 w-60`} onPress={linkToMobileWallet}>
      {i18n(`iDontHaveAWallet.mobileWallet.${isIOS() ? 'iOS' : 'android'}`)}
    </PrimaryButton>
    <View style={tw`mt-10`}>
      <Icon
        id="shiftCrypto"
        style={tw`w-64 h-64 opacity-40 absolute -top-6 left-1/2 -ml-32`}
        color={tw`text-white-1`.color as string}
      />
      <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl`}>
        {i18n('iDontHaveAWallet.signingDevice.title')}
      </Headline>
      <Text style={tw`text-center text-white-1 mt-3`}>
        {i18n('iDontHaveAWallet.signingDevice.1')}
        <Text style={tw`font-bold text-white-1`}> {i18n('iDontHaveAWallet.signingDevice.2')}</Text>
      </Text>
      <PrimaryButton style={tw`flex items-center mt-8 w-60`} onPress={linkToBitbox}>
        {i18n('iDontHaveAWallet.signingDevice.cta')}
      </PrimaryButton>
    </View>
    <View style={tw`mt-10`}>
      <Icon
        id="shiftCrypto"
        style={tw`w-64 h-64 opacity-40 absolute -top-6 left-1/2 -ml-32`}
        color={tw`text-white-1`.color}
      />
      <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl`}>
        {i18n('iDontHaveAWallet.signingDevice.title')}
      </Headline>
      <Text style={tw`text-center text-white-1 mt-3`}>
        {i18n('iDontHaveAWallet.signingDevice.1')}
        <Text style={tw`font-bold text-white-1`}> {i18n('iDontHaveAWallet.signingDevice.2')}</Text>
      </Text>
      <PrimaryButton style={tw`flex items-center mt-8 w-60`} onPress={linkToBitbox}>
        {i18n('iDontHaveAWallet.signingDevice.cta')}
      </PrimaryButton>
    </View>
  </View>
)

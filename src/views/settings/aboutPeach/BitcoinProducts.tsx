import { Linking, TouchableOpacity, View } from 'react-native'
import { Icon } from '../../../components/Icon'
import { PeachText } from '../../../components/text/Text'
import { useHeaderSetup } from '../../../hooks/useHeaderSetup'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export default () => {
  useHeaderSetup({ title: i18n('settings.bitcoinProducts') })

  const goToShiftCrypto = () => Linking.openURL('https://shiftcrypto.ch/bitbox02/?ref=DLX6l9ccCc')

  return (
    <View style={tw`justify-center flex-grow p-8`}>
      <PeachText style={tw`h5`}>{i18n('settings.bitcoinProducts.proSecurity')}</PeachText>
      <PeachText style={tw`mt-1`}>
        {i18n('settings.bitcoinProducts.proSecurity.description1')}
        {'\n\n'}
        {i18n('settings.bitcoinProducts.proSecurity.description2')}
      </PeachText>
      <TouchableOpacity style={tw`flex-row items-center gap-4 mt-4`} onPress={goToShiftCrypto}>
        <PeachText style={tw`text-primary-main settings underline`}>{i18n('settings.bitcoinProducts.bitBox')}</PeachText>
        <Icon id="externalLink" style={tw`w-6 h-6 -mt-1`} color={tw`text-primary-main`.color} />
      </TouchableOpacity>
    </View>
  )
}

import { Linking, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon, Text } from '../../../components'
import { useHeaderSetup } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export default () => {
  useHeaderSetup({ title: i18n('settings.bitcoinProducts') })

  const goToShiftCrypto = () => Linking.openURL('https://shiftcrypto.ch/bitbox02/?ref=DLX6l9ccCc')

  return (
    <View style={tw`justify-center flex-grow p-8`}>
      <Text style={tw`h5`}>{i18n('settings.bitcoinProducts.proSecurity')}</Text>
      <Text style={tw`body-m mt-1`}>
        {i18n('settings.bitcoinProducts.proSecurity.description1')}
        {'\n\n'}
        {i18n('settings.bitcoinProducts.proSecurity.description2')}
      </Text>
      <TouchableOpacity style={tw`flex-row items-center gap-4 mt-4`} onPress={goToShiftCrypto}>
        <Text style={tw`text-primary-main h6 underline`}>{i18n('settings.bitcoinProducts.bitBox')}</Text>
        <Icon id="externalLink" style={tw`w-6 h-6 -mt-1`} color={tw`text-primary-main`.color} />
      </TouchableOpacity>
    </View>
  )
}

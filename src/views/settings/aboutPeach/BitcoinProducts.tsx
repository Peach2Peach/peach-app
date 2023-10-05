import { TouchableOpacity, View } from 'react-native'
import { Header, Screen } from '../../../components'
import { Icon } from '../../../components/Icon'
import { PeachText } from '../../../components/text/Text'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { goToShiftCrypto } from '../../../utils/web'

export const BitcoinProducts = () => (
  <Screen header={<Header title={i18n('settings.bitcoinProducts')} />}>
    <View style={tw`justify-center grow`}>
      <PeachText style={tw`h5`}>{i18n('settings.bitcoinProducts.proSecurity')}</PeachText>
      <PeachText style={tw`mt-1`}>
        {i18n('settings.bitcoinProducts.proSecurity.description1')}
        {'\n\n'}
        {i18n('settings.bitcoinProducts.proSecurity.description2')}
      </PeachText>
      <TouchableOpacity style={tw`flex-row items-center gap-4 mt-4`} onPress={goToShiftCrypto}>
        <PeachText style={tw`underline text-primary-main settings`}>{i18n('settings.bitcoinProducts.bitBox')}</PeachText>
        <Icon id="externalLink" style={tw`w-6 h-6 -mt-1`} color={tw`text-primary-main`.color} />
      </TouchableOpacity>
    </View>
  </Screen>
)

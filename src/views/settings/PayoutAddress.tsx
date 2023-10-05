import { View } from 'react-native'

import { Header, Icon, PeachScrollView, PrimaryButton, Screen, Text } from '../../components'
import { OpenWallet } from '../../components/bitcoin'
import { BitcoinAddressInput, Input } from '../../components/inputs'
import { useRoute, useShowHelp } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { usePayoutAddressSetup } from './hooks/usePayoutAddressSetup'

export const PayoutAddress = () => {
  const {
    type,
    address,
    setAddress,
    addressErrors,
    addressValid,
    addressLabel,
    setAddressLabel,
    addressLabelErrors,
    addressLabelValid,
    isUpdated,
    save,
  } = usePayoutAddressSetup()

  return (
    <Screen>
      <PayoutAddressHeader />
      <PeachScrollView contentContainerStyle={tw`items-center justify-center px-8 grow`}>
        <Text style={tw`text-center h6`}>
          {i18n(type === 'refund' ? 'settings.refundAddress.title' : 'settings.payoutAddress.title')}
        </Text>
        <Input
          style={tw`mt-4`}
          value={addressLabel}
          placeholder={i18n('form.address.label.placeholder')}
          onChange={setAddressLabel}
          errorMessage={addressLabelErrors}
        />
        <BitcoinAddressInput onChange={setAddress} value={address} errorMessage={addressErrors} />
        {isUpdated ? (
          <View style={tw`flex-row justify-center gap-1 h6`}>
            <Text style={tw`uppercase button-medium`}>{i18n('settings.payoutAddress.success')}</Text>
            <Icon id="check" size={20} color={tw`text-success-main`.color} />
          </View>
        ) : (
          <OpenWallet style={tw`h-6`} address={address} />
        )}
      </PeachScrollView>
      <PrimaryButton
        narrow
        style={tw`self-center`}
        onPress={save}
        disabled={!address || !addressLabel || !addressValid || !addressLabelValid || isUpdated}
      >
        {i18n(type === 'refund' ? 'settings.refundAddress.confirm' : 'settings.payoutAddress.confirm')}
      </PrimaryButton>
    </Screen>
  )
}

function PayoutAddressHeader () {
  const { type } = useRoute<'payoutAddress'>().params || {}
  const showHelp = useShowHelp('payoutAddress')
  const title = {
    refund: 'settings.refundAddress',
    payout: 'settings.payoutAddress',
  }
  return <Header title={i18n(title[type || 'payout'])} icons={[{ ...headerIcons.help, onPress: showHelp }]} />
}

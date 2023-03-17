import React, { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'
import { Icon, PeachScrollView, PrimaryButton, Text } from '../../components'
import { BitcoinAddressInput, Input } from '../../components/inputs'
import i18n from '../../utils/i18n'
import { usePayoutAddressSetup } from './hooks/usePayoutAddressSetup'
import { OpenWallet } from '../../components/bitcoin'

export default (): ReactElement => {
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
    <View style={tw`items-center justify-between h-full`}>
      <PeachScrollView style={tw`flex-shrink w-full h-full`} contentContainerStyle={tw`justify-center h-full p-8`}>
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
        <OpenWallet address={address} />
        {isUpdated && (
          <View style={tw`flex-row justify-center w-full h-0`}>
            <Text style={tw`h-6 uppercase button-medium`}>{i18n('settings.payoutAddress.success')}</Text>
            <Icon id="check" style={tw`w-5 h-5 ml-1`} color={tw`text-success-main`.color} />
          </View>
        )}
      </PeachScrollView>
      <PrimaryButton
        narrow
        style={tw`absolute mt-16 bottom-6`}
        onPress={save}
        disabled={!address || !addressLabel || !addressValid || !addressLabelValid || isUpdated}
      >
        {i18n(type === 'refund' ? 'settings.refundAddress.confirm' : 'settings.payoutAddress.confirm')}
      </PrimaryButton>
    </View>
  )
}

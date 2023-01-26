import React, { ReactElement, useMemo } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { OptionButton, PeachScrollView, PrimaryButton, Text } from '../../components'
import { account } from '../../utils/account'
import { getContract, getOfferHexIdFromContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { useRoute, useNavigation, useHeaderSetup } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { submitRaiseDispute } from './utils/submitRaiseDispute'
const disputeReasonsBuyer: DisputeReason[] = ['noPayment.buyer', 'unresponsive.buyer', 'abusive', 'other']
const disputeReasonsSeller: DisputeReason[] = ['noPayment.seller', 'unresponsive.seller', 'abusive', 'other']

export default (): ReactElement => {
  const route = useRoute<'disputeReasonSelector'>()
  const contract = getContract(route.params.contractId)

  const view = contract ? (account.publicKey === contract.seller.id ? 'seller' : 'buyer') : ''
  const availableReasons = view === 'seller' ? disputeReasonsSeller : disputeReasonsBuyer

  const navigation = useNavigation()
  const showError = useShowErrorBanner()

  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('dispute.disputeForTrade', !!contract ? getOfferHexIdFromContract(contract) : ''),
      }),
      [contract],
    ),
  )

  // Set reason and navigate to dispute form
  const setReason = async (reason: DisputeReason) => {
    if (!contract) return
    if (reason === 'noPayment.buyer' || reason === 'noPayment.seller') {
      navigation.navigate('disputeForm', { contractId: contract.id, reason })
    } else {
      const disputeRaised = await submitRaiseDispute(contract, reason)
      if (disputeRaised) {
        // todo : show dispute raised success
        navigation.goBack()
      } else {
        showError()
      }
    }
  }

  return (
    <View style={tw`flex-col items-center justify-between h-full px-6 pt-6 pb-10`}>
      <PeachScrollView contentContainerStyle={tw`items-center justify-center flex-grow`}>
        <Text style={tw`text-center h6`}>{i18n('contact.whyAreYouContactingUs')}</Text>
        {availableReasons.map((rsn, i) => (
          <OptionButton key={rsn} onPress={() => setReason(rsn)} style={[tw`w-64 mt-4`]} narrow>
            {i18n(`dispute.reason.${rsn}`)}
          </OptionButton>
        ))}
      </PeachScrollView>
      <PrimaryButton onPress={navigation.goBack} style={tw`mt-2`} narrow>
        {i18n('back')}
      </PrimaryButton>
    </View>
  )
}

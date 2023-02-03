import React, { ReactElement, useMemo } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { OptionButton, PeachScrollView, Text } from '../../components'
import { account } from '../../utils/account'
import { getContract, getContractViewer, getOfferHexIdFromContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { useRoute, useNavigation, useHeaderSetup } from '../../hooks'
import { submitRaiseDispute } from './utils/submitRaiseDispute'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { useDisputeRaisedSuccess } from '../../overlays/dispute/hooks/useDisputeRaisedSuccess'
const disputeReasonsBuyer: DisputeReason[] = ['noPayment.buyer', 'unresponsive.buyer', 'abusive', 'other']
const disputeReasonsSeller: DisputeReason[] = ['noPayment.seller', 'unresponsive.seller', 'abusive', 'other']

export default (): ReactElement => {
  const route = useRoute<'disputeReasonSelector'>()
  const contract = getContract(route.params.contractId)

  const view = contract ? getContractViewer(contract, account) : ''
  const availableReasons = view === 'seller' ? disputeReasonsSeller : disputeReasonsBuyer

  const navigation = useNavigation()
  const showError = useShowErrorBanner()

  const disputeRaisedOverlay = useDisputeRaisedSuccess()

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
      const [success, error] = await submitRaiseDispute(contract, reason)
      if (success) {
        if (view) {
          disputeRaisedOverlay(view)
        }
        navigation.goBack()
      } else {
        showError(error ? error?.error : null)
      }
    }
  }

  return (
    <View style={tw`flex-col items-center justify-between h-full px-6 pt-6 pb-10`}>
      <PeachScrollView contentContainerStyle={tw`items-center justify-center flex-grow`}>
        <Text style={tw`text-center h6`}>{i18n('contact.whyAreYouContactingUs')}</Text>
        {availableReasons.map((rsn) => (
          <OptionButton key={rsn} onPress={() => setReason(rsn)} style={[tw`w-64 mt-4`]} narrow>
            {i18n(`dispute.reason.${rsn}`)}
          </OptionButton>
        ))}
      </PeachScrollView>
    </View>
  )
}

import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import { Headline, Text, PrimaryButton } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import tw from '../../styles/tailwind'
import { saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'

type DisputeLostBuyerProps = {
  contract: Contract
  navigate: () => void
}

export const DisputeLostBuyer = ({ contract, navigate }: DisputeLostBuyerProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => {
    saveContract({
      ...contract,
      disputeResultAcknowledged: true,
      cancelConfirmationDismissed: true,
    })
    navigate()
    updateOverlay({ visible: false })
  }

  return (
    <View style={tw`px-6`}>
      <Headline style={tw`text-3xl leading-3xl text-white-1`}>{i18n('dispute.lost')}</Headline>
      <View style={tw`flex items-center justify-center`}>
        <View style={tw`flex items-center justify-center`}>
          <Text style={tw`text-center text-white-1`}>{i18n('dispute.buyer.lost.text.1')}</Text>
          {!contract.paymentConfirmed && (
            <Text style={tw`mt-2 text-center text-white-1`}>{i18n('dispute.buyer.lost.text.2')}</Text>
          )}
        </View>
        <PrimaryButton style={tw`mt-5`} onPress={closeOverlay} narrow>
          {i18n('close')}
        </PrimaryButton>
      </View>
    </View>
  )
}

import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import { Button, Headline, Text } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import tw from '../../styles/tailwind'
import { saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'

type DisputeWonBuyerProps = {
  contract: Contract,
  navigate: () => void,
}

export const DisputeWonBuyer = ({ contract, navigate }: DisputeWonBuyerProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => {
    saveContract({
      ...contract,
      disputeResultAcknowledged: true,
      cancelConfirmationDismissed: true,
    })
    navigate()
    updateOverlay({ content: null, showCloseButton: true })
  }

  return <View style={tw`px-6`}>
    <Headline style={tw`text-3xl leading-3xl text-white-1`}>
      {i18n('dispute.won')}
    </Headline>
    <View style={tw`flex justify-center items-center`}>
      <View style={tw`flex justify-center items-center`}>
        <Text style={tw`text-white-1 text-center`}>
          {i18n('dispute.buyer.won.text.1')}
        </Text>
        {!contract.paymentConfirmed
          ? <Text style={tw`text-white-1 text-center mt-2`}>
            {i18n('dispute.buyer.won.text.2')}
          </Text>
          : null
        }
      </View>
      <Button
        style={tw`mt-5`}
        title={i18n('close')}
        secondary={true}
        wide={false}
        onPress={closeOverlay}
      />
    </View>
  </View>
}
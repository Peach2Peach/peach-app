import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import { Headline, PrimaryButton, Text } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import tw from '../../styles/tailwind'
import { saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { Navigation } from '../../utils/navigation'
import Refund from '../Refund'

type DisputeWonSellerProps = {
  contract: Contract
  offer: SellOffer
  navigate: () => void
  navigation: Navigation
}

export const DisputeWonSeller = ({ contract, offer, navigate, navigation }: DisputeWonSellerProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => {
    saveContract({
      ...contract,
      disputeResultAcknowledged: true,
    })
    navigate()
    updateOverlay({ content: null, showCloseButton: true })
  }
  const refund = () => {
    saveContract({
      ...contract,
      disputeResultAcknowledged: true,
      cancelConfirmationDismissed: true,
    })
    updateOverlay({
      content: <Refund {...{ sellOffer: offer, navigate, navigation }} />,
      showCloseButton: false,
    })
  }

  return (
    <View style={tw`px-6`}>
      <Headline style={tw`text-3xl leading-3xl text-white-1`}>{i18n('dispute.won')}</Headline>
      <View style={tw`flex justify-center items-center`}>
        <View style={tw`flex justify-center items-center`}>
          <Text style={tw`text-white-1 text-center`}>{i18n('dispute.seller.won.text.1')}</Text>
          {!offer.refunded && <Text style={tw`text-white-1 text-center mt-2`}>{i18n('dispute.seller.won.text.2')}</Text>}
        </View>
        <PrimaryButton style={tw`mt-5`} onPress={offer.refunded ? closeOverlay : refund} narrow>
          {i18n(offer.refunded ? 'close' : 'dispute.seller.won.button')}
        </PrimaryButton>
      </View>
    </View>
  )
}

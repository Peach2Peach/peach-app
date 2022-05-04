import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { OfferScreenNavigationProp } from '../Offer'

type OfferCompleteProps = {
  offer: BuyOffer|SellOffer,
  navigation: OfferScreenNavigationProp,
}
export const OfferComplete = ({ offer, navigation }: OfferCompleteProps): ReactElement => {
  return <View style={tw`flex-row justify-between items-center`}>
     
  </View>
}
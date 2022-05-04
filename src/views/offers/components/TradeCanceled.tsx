import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { OfferScreenNavigationProp } from '../Offer'

type TradeCanceledProps = {
  offer: BuyOffer|SellOffer,
  navigation: OfferScreenNavigationProp,
}
export const TradeCanceled = ({ offer, navigation }: TradeCanceledProps): ReactElement => {
  return <View style={tw`flex-row justify-between items-center`}>
     
  </View>
}
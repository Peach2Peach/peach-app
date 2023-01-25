import React, { ReactElement } from 'react'
import MatchCarousel from './MatchCarousel'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { MatchOfferButton, MatchHelpButton } from './buttons'
import { useMatchesSetup } from './hooks'
import { useOfferDetails } from '../../hooks'
import { isBuyOffer } from '../../utils/offer'

export const Matches = ({ offerId }: { offerId: string }): ReactElement => {
  useMatchesSetup()
  const { offer } = useOfferDetails(offerId)
  if (!offer) return <></>

  return (
    <View style={tw`flex-col justify-end flex-shrink h-full`}>
      <MatchCarousel offerId={offerId} />
      <View style={tw`flex-row items-center justify-center pl-11`}>
        <MatchOfferButton offer={offer} />
        <MatchHelpButton isBuyOffer={isBuyOffer(offer)} />
      </View>
    </View>
  )
}

export default Matches

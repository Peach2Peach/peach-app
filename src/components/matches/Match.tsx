import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Text } from '..'
import { useOfferDetails } from '../../hooks'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { isSellOffer } from '../../utils/offer'
import { UnmatchButton } from './buttons'
import { CurrencySelector, PaymentMethodSelector, PriceInfo, UserInfo } from './components'

type MatchProps = ComponentProps & {
  match: Match
  renderShadow?: boolean
  offerId: string
}

export const Match = ({ match, renderShadow, offerId }: MatchProps): ReactElement => {
  const { offer } = useOfferDetails(offerId)
  if (!offer) return <></>

  return (
    <View style={[tw`w-full my-5 border rounded-md border-grey-4 bg-white-1`, match.matched ? tw`border-peach-1` : {}]}>
      {match.matched && (
        <View style={tw`absolute top-0 left-0 z-20 w-full h-full`}>
          <UnmatchButton {...{ match, offer }} />
          <View style={tw`w-full h-full bg-peach-translucent opacity-30`} />
          <Text style={tw`absolute w-full text-xs text-center bottom-full font-baloo text-peach-1`}>
            {i18n('search.matched')}
          </Text>
        </View>
      )}
      <View style={tw`px-5 pt-5 pb-8`}>
        <UserInfo user={match.user} isSellOffer={isSellOffer(offer)} />
        <PriceInfo match={match} />
        <CurrencySelector matchId={match.offerId} offer={offer} />
        <PaymentMethodSelector matchId={match.offerId} offer={offer} />
      </View>
    </View>
  )
}

export default Match

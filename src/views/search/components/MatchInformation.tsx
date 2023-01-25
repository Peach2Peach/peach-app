import React from 'react'
import { View } from 'react-native'
import { Headline, SatsFormat, Text } from '../../../components'
import { useOfferDetails } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useOfferMatches } from '../hooks/useOfferMatches'

export const MatchInformation = ({ offerId }: { offerId: string }) => {
  const { offer } = useOfferDetails(offerId)
  const { allMatches: matches } = useOfferMatches()
  if (!offer) return <></>
  const { type, amount, premium } = offer
  return (
    <>
      <Headline style={[tw`text-2xl text-center uppercase leading-2xl text-peach-1`, tw.md`text-3xl leading-3xl`]}>
        {i18n(matches.length === 1 ? 'search.youGotAMatch' : 'search.youGotAMatches')}
      </Headline>
      <View>
        <Text style={tw`-mt-1 text-center text-grey-2`}>
          {i18n(`search.${type === 'bid' ? 'buyOffer' : 'sellOffer'}`)}{' '}
          <SatsFormat sats={amount} color={tw`text-grey-2`} />
        </Text>
        {type !== 'bid' && (
          <Text style={tw`text-center text-grey-2`}>
            {i18n(premium > 0 ? 'search.atPremium' : 'search.atDiscount', String(Math.abs(premium)))}
          </Text>
        )}
      </View>
    </>
  )
}

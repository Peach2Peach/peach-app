import React from 'react'
import { View } from 'react-native'
import { Headline, SatsFormat, Text } from '../../../components'
import { useMatchStore } from '../../../components/matches/store'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useOfferMatches } from '../hooks/useOfferMatches'

export const MatchInformation = () => {
  const { type, amount, premium } = useMatchStore((state) => state.offer)
  const { allMatches: matches } = useOfferMatches()
  return (
    <>
      <Headline style={[tw`text-2xl text-center uppercase leading-2xl text-peach-1`, tw.md`text-3xl leading-3xl`]}>
        {i18n(matches.length === 1 ? 'search.youGotAMatch' : 'search.youGotAMatches')}
      </Headline>
      <View>
        <Text style={tw`-mt-1 text-center text-grey-2`}>
          {i18n(`search.${type === 'bid' ? 'buyOffer' : 'sellOffer'}`)}{' '}
          <SatsFormat sats={type === 'bid' ? amount[0] : amount} color={tw`text-grey-2`} />
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

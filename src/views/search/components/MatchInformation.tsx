import React from 'react'
import { View } from 'react-native'
import { Headline, SatsFormat, Text } from '../../../components'
import { useRoute } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useOfferMatches } from '../hooks/useOfferMatches'

export const MatchInformation = () => {
  const { type, amount, premium } = useRoute<'search'>().params.offer
  const { allMatches: matches } = useOfferMatches()
  return (
    <>
      <Headline style={[tw`text-center text-2xl leading-2xl uppercase text-peach-1`, tw.md`text-3xl leading-3xl`]}>
        {i18n(matches.length === 1 ? 'search.youGotAMatch' : 'search.youGotAMatches')}
      </Headline>
      <View>
        <Text style={tw`text-grey-2 text-center -mt-1`}>
          {i18n(`search.${type === 'bid' ? 'buyOffer' : 'sellOffer'}`)}{' '}
          <SatsFormat sats={amount} color={tw`text-grey-2`} />
        </Text>
        {type !== 'bid' && (
          <Text style={tw`text-grey-2 text-center`}>
            {i18n(premium > 0 ? 'search.atPremium' : 'search.atDiscount', String(Math.abs(premium)))}
          </Text>
        )}
      </View>
    </>
  )
}

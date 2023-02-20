import React from 'react'
import { View } from 'react-native'
import { SatsFormat, Text } from '../../../components'
import { getPremiumColor } from '../../../components/matches/utils'
import { useRoute } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useOfferMatches } from '../hooks/useOfferMatches'

export const MatchInformation = ({ offer }: { offer: SellOffer }) => {
  const { offerId } = useRoute<'search'>().params
  const { allMatches: matches } = useOfferMatches(offerId)
  const { amount } = offer
  const color = getPremiumColor(offer.premium || 0, false)

  return (
    <>
      <Text style={tw`text-center h4 text-primary-main`}>
        {i18n(`search.youGot${matches.length === 1 ? 'AMatch' : 'Matches'}`)}
      </Text>
      <Text style={tw`text-center body-l text-black-2 mt-5`}>{i18n('search.sellOffer')}:</Text>
      <View style={tw`flex-row items-center justify-center mb-10`}>
        {typeof amount === 'number' && (
          <SatsFormat
            containerStyle={tw`items-center self-center mr-1`}
            sats={amount}
            style={tw`leading-loose body-l text-2xl`}
            bitcoinLogoStyle={tw`w-[18px] h-[18px] mr-2`}
            satsStyle={tw`subtitle-1`}
          />
        )}
        {offer.premium && (
          <Text style={[tw`body-l leading-loose`, color]}>
            {' '}
            ({offer.premium > 0 ? '+' : ''}
            {String(offer.premium)}%)
          </Text>
        )}
      </View>
    </>
  )
}

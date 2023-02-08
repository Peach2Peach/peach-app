import React from 'react'
import { SatsFormat, Text } from '../../../components'
import { useRoute } from '../../../hooks'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useOfferMatches } from '../hooks/useOfferMatches'

export const MatchInformation = () => {
  const { offerId } = useRoute<'search'>().params
  const { offer } = useOfferDetails(offerId)
  const { allMatches: matches } = useOfferMatches(offerId)
  if (!offer) return <></>

  const { amount } = offer

  return (
    <>
      <Text style={tw`text-center h4 text-primary-main`}>
        {i18n(`search.youGot${matches.length === 1 ? 'AMatch' : 'Matches'}`)}
      </Text>
      <Text style={tw`text-center body-l text-black-2`}>{i18n('search.sellOffer')}:</Text>
      {typeof amount === 'number' && (
        <SatsFormat
          containerStyle={tw`items-center self-center mt-2 mb-16`}
          sats={amount}
          style={tw`leading-loose body-l`}
          bitcoinLogoStyle={tw`w-[18px] h-[18px] mr-1`}
          satsStyle={tw`subtitle-1`}
        />
      )}
    </>
  )
}

import React from 'react'
import i18n from '../../../utils/i18n'
import Button from '../../Button'
import { useMatchOffer } from '../../../views/search/match'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useOfferMatches } from '../../../views/search/hooks/useOfferMatches'
import { useMatchStore } from '../store'

export const MatchOfferButton = () => {
  const { offer } = useRoute<RouteProp<{ params: RootStackParamList['search'] }>>().params

  const {
    data: { matches },
  } = useOfferMatches()
  const currentIndex = useMatchStore().currentIndex
  const currentMatch = matches[currentIndex]

  const { mutate: matchOffer, isLoading } = useMatchOffer(offer, currentMatch)

  return (
    <Button
      title={i18n(
        `search.${offer.type === 'bid' ? (currentMatch.matched ? 'waitingForSeller' : 'matchOffer') : 'acceptMatch'}`,
      )}
      wide={false}
      disabled={currentMatch.matched || isLoading}
      loading={isLoading} /** NOTE: We did not indicate a loading state for 'ask' offers previously. Is this fine? */
      onPress={matchOffer}
    />
  )
}

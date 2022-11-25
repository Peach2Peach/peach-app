import React from 'react'
import i18n from '../../../utils/i18n'
import Button from '../../Button'
import { useOfferMatches } from '../../../views/search/hooks/useOfferMatches'
import { useMatchStore } from '../store'
import { useMatchOffer, useSearchRoute } from '../hooks'

export const MatchOfferButton = () => {
  const { offer } = useSearchRoute().params

  const { allMatches: matches } = useOfferMatches()
  const currentIndex = useMatchStore((state) => state.currentIndex)
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

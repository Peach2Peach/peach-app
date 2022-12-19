import React from 'react'
import i18n from '../../../utils/i18n'
import Button from '../../Button'
import { useOfferMatches } from '../../../views/search/hooks/useOfferMatches'
import { useMatchStore } from '../store'
import { useMatchOffer } from '../hooks'
import { isBuyOffer } from '../../../utils/offer'

export const MatchOfferButton = () => {
  const { allMatches: matches } = useOfferMatches()
  const [offer, currentIndex] = useMatchStore((state) => [state.offer, state.currentIndex])
  const currentMatch = matches[currentIndex]

  const { mutate: matchOffer, isLoading } = useMatchOffer(offer, currentMatch)

  return (
    <Button
      title={i18n(
        `search.${isBuyOffer(offer) ? (currentMatch?.matched ? 'waitingForSeller' : 'matchOffer') : 'acceptMatch'}`,
      )}
      wide={false}
      disabled={currentMatch?.matched || isLoading}
      loading={isLoading}
      onPress={matchOffer}
    />
  )
}

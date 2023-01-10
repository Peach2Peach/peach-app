import React from 'react'
import shallow from 'zustand/shallow'
import i18n from '../../../utils/i18n'
import { isBuyOffer } from '../../../utils/offer'
import { useOfferMatches } from '../../../views/search/hooks/useOfferMatches'
import { PrimaryButton } from '../../buttons'
import { useMatchOffer } from '../hooks'
import { useMatchStore } from '../store'

export const MatchOfferButton = () => {
  const { allMatches: matches } = useOfferMatches()
  const [offer, currentIndex] = useMatchStore((state) => [state.offer, state.currentIndex], shallow)
  const currentMatch = matches[currentIndex]

  const { mutate: matchOffer, isLoading } = useMatchOffer(offer, currentMatch)

  return (
    <PrimaryButton narrow disabled={currentMatch.matched || isLoading} loading={isLoading} onPress={() => matchOffer()}>
      {i18n(`search.${isBuyOffer(offer) ? (currentMatch.matched ? 'waitingForSeller' : 'matchOffer') : 'acceptMatch'}`)}
    </PrimaryButton>
  )
}

import { useEffect } from 'react'
import shallow from 'zustand/shallow'
import { unique } from '../../../utils/array'
import { saveOffer } from '../../../utils/offer'
import { useOfferMatches } from '../../../views/search/hooks/useOfferMatches'
import { useMatchStore } from '../store'

export const useMatchesSetup = () => {
  const { allMatches: matches, fetchNextPage, hasNextPage } = useOfferMatches()

  const [offer, currentIndex, setCurrentIndex] = useMatchStore(
    (state) => [state.offer, state.currentIndex, state.setCurrentIndex],
    shallow,
  )

  useEffect(() => {
    setCurrentIndex(0)
    return () => setCurrentIndex(0)
  }, [setCurrentIndex])

  useEffect(() => {
    const seenMatches = (offer.seenMatches || []).concat([matches[currentIndex]?.offerId]).filter(unique())
    saveOffer({
      ...offer,
      seenMatches,
    })
    if (currentIndex === matches.length - 1 && hasNextPage) fetchNextPage()
  }, [currentIndex, fetchNextPage, hasNextPage, matches, offer])
}

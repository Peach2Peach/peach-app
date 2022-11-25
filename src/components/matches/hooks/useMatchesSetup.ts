import { useEffect } from 'react'
import { unique } from '../../../utils/array'
import { saveOffer } from '../../../utils/offer'
import { useOfferMatches } from '../../../views/search/hooks/useOfferMatches'
import { useMatchStore } from '../store'
import shallow from 'zustand/shallow'
import { useSearchRoute } from './useSearchRoute'

export const useMatchesSetup = () => {
  const { offer } = useSearchRoute().params
  const { allMatches: matches, fetchNextPage, hasNextPage } = useOfferMatches()

  const { currentIndex, setCurrentIndex } = useMatchStore(
    (state) => ({
      currentIndex: state.currentIndex,
      setCurrentIndex: state.setCurrentIndex,
    }),
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

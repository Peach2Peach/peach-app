import { useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { useRoute } from '../../../hooks'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { unique } from '../../../utils/array'
import { saveOffer } from '../../../utils/offer'
import { useOfferMatches } from '../../../views/search/hooks'
import { useMatchStore } from '../store'

export const useMatchesSetup = () => {
  const { offerId } = useRoute<'search'>().params
  const { offer } = useOfferDetails(offerId)
  const { allMatches: matches, fetchNextPage, hasNextPage } = useOfferMatches(offerId)

  const [currentIndex, setCurrentIndex] = useMatchStore((state) => [state.currentIndex, state.setCurrentIndex], shallow)

  useEffect(() => {
    setCurrentIndex(0)
    return () => setCurrentIndex(0)
  }, [setCurrentIndex])

  useEffect(() => {
    if (!offer?.id) return

    const seenMatches = (offer.seenMatches || []).concat([matches[currentIndex]?.offerId]).filter(unique())
    saveOffer({
      ...offer,
      seenMatches,
    })
    if (currentIndex === matches.length - 1 && hasNextPage) fetchNextPage()
  }, [currentIndex, fetchNextPage, hasNextPage, matches, offer])
}

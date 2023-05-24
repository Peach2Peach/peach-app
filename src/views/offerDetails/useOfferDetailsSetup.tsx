import { useEffect } from 'react'
import { useHeaderSetup, useRoute } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { OfferDetailsTitle } from './components/OfferDetailsTitle'

export const useOfferDetailsSetup = () => {
  const { offerId } = useRoute<'offer'>().params
  const { offer, error } = useOfferDetails(offerId)

  const showErrorBanner = useShowErrorBanner()

  useEffect(() => {
    if (error) {
      showErrorBanner(error?.error)
    }
  }, [error, offerId, showErrorBanner])

  useHeaderSetup({ titleComponent: <OfferDetailsTitle id={offerId} /> })

  return offer
}

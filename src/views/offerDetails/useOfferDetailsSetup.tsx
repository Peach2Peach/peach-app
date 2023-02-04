import { useEffect } from 'react'

import { useRoute } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'

export const useOfferDetailsSetup = () => {
  const { offerId } = useRoute<'offer'>().params
  const { offer, error } = useOfferDetails(offerId)

  const showErrorBanner = useShowErrorBanner()

  useEffect(() => {
    if (error) {
      showErrorBanner(error?.error)
    }
  }, [error, offerId, showErrorBanner])

  return offer
}

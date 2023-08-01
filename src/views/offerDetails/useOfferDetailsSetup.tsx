import { useEffect } from 'react'
import { useHeaderSetup, useRoute } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { offerIdToHex } from '../../utils/offer'

export const useOfferDetailsSetup = () => {
  const { offerId } = useRoute<'offer'>().params
  const { offer, error } = useOfferDetails(offerId)

  const showErrorBanner = useShowErrorBanner()

  useEffect(() => {
    if (error) {
      showErrorBanner(error?.error)
    }
  }, [error, offerId, showErrorBanner])

  useHeaderSetup(offerIdToHex(offerId))

  return offer
}

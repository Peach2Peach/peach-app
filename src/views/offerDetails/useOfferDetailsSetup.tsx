import { useEffect } from 'react'

import { useHeaderSetup, useRoute } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import i18n from '../../utils/i18n'

export const useOfferDetailsSetup = () => {
  const { offerId } = useRoute<'offer'>().params
  const { offer, error } = useOfferDetails(offerId)

  const showErrorBanner = useShowErrorBanner()

  useEffect(() => {
    if (error) {
      showErrorBanner(error?.error)
    }
  }, [error, offerId, showErrorBanner])

  useHeaderSetup({ title: `${i18n('offer')} ${offerId}` })

  return offer
}

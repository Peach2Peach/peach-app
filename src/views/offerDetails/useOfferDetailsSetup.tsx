import { useEffect } from 'react'
import { Text } from '../../components'

import { useHeaderSetup, useRoute } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
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

  useHeaderSetup({
    titleComponent: (
      <Text style={tw`h6`}>
        {i18n('offer')} {offerIdToHex(offerId)}
      </Text>
    ),
  })

  return offer
}

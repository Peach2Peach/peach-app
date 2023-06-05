import { useEffect } from 'react'
import { useNavigation } from '../../../hooks'
import { info } from '../../../utils/log'
import { saveOffer } from '../../../utils/offer'
import { useStartRefundPopup } from '../../../popups/useStartRefundPopup'
import { useShowWronglyFundedPopup } from '../../../popups/useShowWronglyFundedPopup'
import { useOfferMatches } from '../../search/hooks/useOfferMatches'

type Props = {
  offerId: string
  sellOffer?: SellOffer
  fundingStatus: FundingStatus
  userConfirmationRequired: boolean
}
export const useHandleFundingStatus = ({ offerId, sellOffer, fundingStatus, userConfirmationRequired }: Props) => {
  const navigation = useNavigation()
  const showWronglyFundedOverlay = useShowWronglyFundedPopup()

  const startRefund = useStartRefundPopup()
  const { refetch: fetchMatches } = useOfferMatches(offerId, fundingStatus.status === 'FUNDED')

  useEffect(() => {
    if (!sellOffer) return

    info('Checked funding status', fundingStatus)
    const updatedOffer = {
      ...sellOffer,
      funding: fundingStatus,
    }

    saveOffer(updatedOffer)

    if (fundingStatus.status === 'CANCELED') {
      startRefund(sellOffer)
      return
    }
    if (fundingStatus.status === 'WRONG_FUNDING_AMOUNT') {
      showWronglyFundedOverlay(updatedOffer)
      return
    }
    if (userConfirmationRequired) {
      navigation.replace('wrongFundingAmount', { offerId: updatedOffer.id })
      return
    }
    if (fundingStatus.status === 'FUNDED') {
      fetchMatches().then(({ data }) => {
        const allMatches = (data?.pages || []).flatMap((page) => page.matches)
        const hasMatches = allMatches.length > 0
        if (hasMatches) {
          navigation.replace('search', { offerId })
        } else {
          navigation.replace('offerPublished', { offerId, isSellOffer: true })
        }
      })
    }
  }, [
    fetchMatches,
    fundingStatus,
    navigation,
    offerId,
    sellOffer,
    showWronglyFundedOverlay,
    startRefund,
    userConfirmationRequired,
  ])
}

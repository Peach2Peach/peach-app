import { useHeaderSetup, useRoute } from '../../../hooks'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { sum } from '../../../utils/math'
import { isSellOffer, offerIdToHex } from '../../../utils/offer'
import { useConfirmEscrow } from './useConfirmEscrow'

export const useWrongFundingAmountSetup = () => {
  const { offerId } = useRoute<'fundEscrow'>().params

  const showErrorBanner = useShowErrorBanner()

  const { offer } = useOfferDetails(offerId)
  const sellOffer = offer && isSellOffer(offer) ? offer : undefined
  const fundingAmount = sellOffer?.amount || 0
  const confirmEscrow = useConfirmEscrow()
  const confirmEscrowWithSellOffer = async () => {
    if (!sellOffer) {
      showErrorBanner()
      return
    }
    await confirmEscrow(sellOffer)
  }

  useHeaderSetup({
    title: offerIdToHex(offerId),
  })

  return {
    sellOffer,
    fundingAmount,
    actualAmount: sellOffer?.funding.amounts.reduce(sum, 0) || 0,
    confirmEscrow: confirmEscrowWithSellOffer,
  }
}

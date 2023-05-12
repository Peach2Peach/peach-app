import { useHeaderSetup, useRoute } from '../../../hooks'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { sum } from '../../../utils/math'
import { isSellOffer } from '../../../utils/offer'
import { OfferDetailsTitle } from '../../offerDetails/components/OfferDetailsTitle'
import { useConfirmEscrow } from './useConfirmEscrow'

export const useWrongFundingAmountSetup = () => {
  const route = useRoute<'fundEscrow'>()
  const { offerId } = route.params

  const showErrorBanner = useShowErrorBanner()

  const { offer } = useOfferDetails(route.params.offerId)
  const sellOffer = offer && isSellOffer(offer) ? offer : undefined
  const fundingAmount = sellOffer ? sellOffer.amount : 0
  const confirmEscrow = useConfirmEscrow()
  const confirmEscrowWithSellOffer = async () => {
    if (!sellOffer) {
      showErrorBanner()
      return
    }
    await confirmEscrow(sellOffer)
  }

  useHeaderSetup({
    titleComponent: <OfferDetailsTitle id={offerId} />,
  })

  return {
    sellOffer,
    fundingAmount,
    actualAmount: sellOffer?.funding.amounts.reduce(sum, 0) || 0,
    confirmEscrow: confirmEscrowWithSellOffer,
  }
}

import { useMemo } from 'react'
import { useConfirmTradeCancelationOverlay } from '../../../overlays/tradeCancelation/useConfirmTradeCancelationOverlay'
import { useConfirmEscrowOverlay } from '../../../overlays/useConfirmEscrowOverlay'
import { useWronglyFundedOverlay } from '../../../overlays/useWronglyFundedOverlay'
import { getContract } from '../../../utils/contract'
import { getOffer } from '../../../utils/offer'
import { getContract as getContractAPI } from '../../../utils/peachAPI'

type PNEventHandlers = Partial<Record<NotificationType, (data: PNData) => void>>

export const usePopupEvents = () => {
  const confirmEscrowOverlay = useConfirmEscrowOverlay()
  const wronglyFundedOverlay = useWronglyFundedOverlay()
  const showConfirmTradeCancelation = useConfirmTradeCancelationOverlay()

  const popupEvents: PNEventHandlers = useMemo(
    () => ({
      // PN-S07
      'offer.fundingAmountDifferent': ({ offerId }: PNData) => {
        const sellOffer = offerId ? (getOffer(offerId) as SellOffer) : null

        if (!sellOffer) return
        confirmEscrowOverlay(sellOffer)
      },
      // PN-S08
      'offer.wrongFundingAmount': ({ offerId }: PNData) => {
        const sellOffer = offerId ? (getOffer(offerId) as SellOffer) : null

        if (!sellOffer) return
        wronglyFundedOverlay(sellOffer)
      },
      // PN-B08
      'contract.cancelationRequest': async ({ contractId }: PNData) => {
        const storedContract = contractId ? getContract(contractId) : null
        let [contract] = contractId ? await getContractAPI({ contractId }) : [null]
        if (contract && storedContract) contract = { ...contract, ...storedContract }

        if (!contract || contract.disputeActive) return
        showConfirmTradeCancelation(contract)
      },
    }),
    [confirmEscrowOverlay, showConfirmTradeCancelation, wronglyFundedOverlay],
  )
  return popupEvents
}

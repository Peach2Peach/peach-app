import { useOverlayContext } from '../../../contexts/overlay'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useShowLoadingPopup } from '../../../hooks/useShowLoadingPopup'
import { saveContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { confirmPayment } from '../../../utils/peachAPI'
import { signReleaseTxOfContract } from '../../../utils/contract/signReleaseTxOfContract'

export const useReleaseEscrow = (contract: Contract) => {
  const [, updateOverlay] = useOverlayContext()

  const showError = useShowErrorBanner()
  const showLoadingPopup = useShowLoadingPopup()
  const closeOverlay = () => {
    updateOverlay({ visible: false })
  }
  const releaseEscrow = async () => {
    showLoadingPopup({
      title: i18n('dispute.lost'),
      level: 'WARN',
    })
    const [tx, errorMsg] = signReleaseTxOfContract(contract)
    if (!tx) {
      closeOverlay()
      return showError(errorMsg)
    }

    const [result, err] = await confirmPayment({ contractId: contract.id, releaseTransaction: tx })
    if (err) {
      closeOverlay()
      return showError(err.error)
    }

    saveContract({
      ...contract,
      paymentConfirmed: new Date(),
      cancelConfirmationDismissed: true,
      releaseTxId: result?.txId || '',
      disputeResultAcknowledged: true,
      disputeResolvedDate: new Date(),
    })
    return closeOverlay()
  }

  return releaseEscrow
}

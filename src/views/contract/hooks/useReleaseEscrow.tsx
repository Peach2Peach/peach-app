import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useShowLoadingPopup } from '../../../hooks/useShowLoadingPopup'
import { usePopupStore } from '../../../store/usePopupStore'
import { saveContract } from '../../../utils/contract'
import { signReleaseTxOfContract } from '../../../utils/contract/signReleaseTxOfContract'
import i18n from '../../../utils/i18n'
import { confirmPayment } from '../../../utils/peachAPI'

export const useReleaseEscrow = (contract: Contract) => {
  const closePopup = usePopupStore((state) => state.closePopup)
  const showError = useShowErrorBanner()
  const showLoadingPopup = useShowLoadingPopup()

  const releaseEscrow = async () => {
    showLoadingPopup({
      title: i18n('dispute.lost'),
      level: 'WARN',
    })
    const [tx, errorMsg] = signReleaseTxOfContract(contract)
    if (!tx) {
      closePopup()
      return showError(errorMsg)
    }

    const [result, err] = await confirmPayment({ contractId: contract.id, releaseTransaction: tx })
    if (err) {
      closePopup()
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
    return closePopup()
  }

  return releaseEscrow
}

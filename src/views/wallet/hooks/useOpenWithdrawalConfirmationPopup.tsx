import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { WithdrawalConfirmation } from '../../../popups/WithdrawalConfirmation'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { parseError } from '../../../utils/result'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { buildDrainWalletTransaction } from '../../../utils/wallet/transaction'

type Props = {
  address: string
  amount: number
  feeRate: number
  shouldDrainWallet?: boolean
  onSuccess: () => void
}

export const useOpenWithdrawalConfirmationPopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const showErrorBanner = useShowErrorBanner()
  const openWithdrawalConfirmationPopup = useCallback(
    async ({ address, amount, feeRate, shouldDrainWallet, onSuccess }: Props) => {
      try {
        const { psbt } = shouldDrainWallet
          ? await peachWallet.finishTransaction(await buildDrainWalletTransaction(address, feeRate))
          : await peachWallet.buildAndFinishTransaction(address, amount, feeRate)
        const confirm = async () => {
          await peachWallet.signAndBroadcastPSBT(psbt)
          onSuccess()
        }
        const fee = await psbt.feeAmount()

        setPopup({
          title: i18n('wallet.confirmWithdraw.title'),
          content: <WithdrawalConfirmation {...{ amount, address, fee, feeRate }} />,
          action2: {
            callback: closePopup,
            label: i18n('cancel'),
            icon: 'xCircle',
          },
          action1: {
            callback: confirm,
            label: i18n('wallet.confirmWithdraw.confirm'),
            icon: 'arrowRightCircle',
          },
          level: 'APP',
        })
      } catch (e) {
        const transactionError = parseError(Array.isArray(e) ? e[0] : e)
        if (transactionError !== 'INSUFFICIENT_FUNDS') return showErrorBanner(transactionError)

        const { needed, available } = Array.isArray(e) ? e[1] : { needed: 0, available: 0 }
        return showErrorBanner('INSUFFICIENT_FUNDS', [needed, available])
      }
    },
    [closePopup, setPopup, showErrorBanner],
  )
  return openWithdrawalConfirmationPopup
}

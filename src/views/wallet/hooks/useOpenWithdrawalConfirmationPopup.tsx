import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useHandleTransactionError } from '../../../hooks/error/useHandleTransactionError'
import { WithdrawalConfirmation } from '../../../popups/WithdrawalConfirmation'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { useShowLoadingPopup } from '../../../hooks/useShowLoadingPopup'

type Props = {
  address: string
  feeRate: number
  onSuccess: (txId: string) => void
}

export const useOpenWithdrawalConfirmationPopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const handleTransactionError = useHandleTransactionError()
  const showLoadingPopup = useShowLoadingPopup()

  const confirmWithdrawal = useCallback(
    async ({ address, feeRate, onSuccess }: Props) => {
      showLoadingPopup({
        title: i18n('wallet.confirmWithdraw.title'),
        level: 'APP',
      })
      try {
        const result = await peachWallet.withdrawAll(address, feeRate)
        onSuccess(await result.txid())
      } catch (e) {
        handleTransactionError(e)
      } finally {
        closePopup()
      }
    },
    [closePopup, handleTransactionError, showLoadingPopup],
  )

  const openWithdrawalConfirmationPopup = useCallback(
    (props: Props) => {
      setPopup({
        title: i18n('wallet.confirmWithdraw.title'),
        content: <WithdrawalConfirmation />,
        visible: true,
        action2: {
          callback: closePopup,
          label: i18n('cancel'),
          icon: 'xCircle',
        },
        action1: {
          callback: () => confirmWithdrawal(props),
          label: i18n('wallet.confirmWithdraw.confirm'),
          icon: 'arrowRightCircle',
        },
        level: 'APP',
      })
    },
    [closePopup, confirmWithdrawal, setPopup],
  )
  return openWithdrawalConfirmationPopup
}

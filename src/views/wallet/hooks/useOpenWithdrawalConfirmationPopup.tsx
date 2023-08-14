import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { WithdrawalConfirmation } from '../../../popups/WithdrawalConfirmation'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { peachWallet } from '../../../utils/wallet/setWallet'

type Props = {
  address: string
  amount: number
  feeRate: number
  onSuccess: () => void
}

export const useOpenWithdrawalConfirmationPopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)

  const openWithdrawalConfirmationPopup = useCallback(
    async ({ address, amount, feeRate, onSuccess }: Props) => {
      if (!peachWallet.wallet) return
      const { psbt } = await peachWallet.buildAndFinishTransaction(address, amount, feeRate)
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
    },
    [closePopup, setPopup],
  )
  return openWithdrawalConfirmationPopup
}

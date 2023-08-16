import { LocalUtxo } from 'bdk-rn/lib/classes/Bindings'
import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../../hooks'
import { WithdrawalConfirmation } from '../../../popups/WithdrawalConfirmation'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { peachWallet } from '../../../utils/wallet/setWallet'

type Props = {
  address: string
  amount: number
  feeRate: number
  shouldDrainWallet?: boolean
  utxos?: LocalUtxo[]
}

export const useOpenWithdrawalConfirmationPopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const navigation = useNavigation()

  const openWithdrawalConfirmationPopup = useCallback(
    async ({ address, amount, feeRate, shouldDrainWallet, utxos }: Props) => {
      const { psbt } = await peachWallet.buildFinishedTransaction({ address, amount, feeRate, shouldDrainWallet, utxos })

      const confirm = async () => {
        await peachWallet.signAndBroadcastPSBT(psbt)
        closePopup()
        navigation.navigate('wallet')
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
    [closePopup, navigation, setPopup],
  )
  return openWithdrawalConfirmationPopup
}

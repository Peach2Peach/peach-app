import { PartiallySignedTransaction } from 'bdk-rn'
import { useClosePopup } from '../../../components/popup/Popup'
import { PopupAction } from '../../../components/popup/PopupAction'
import { PopupComponent } from '../../../components/popup/PopupComponent'
import { useHandleTransactionError } from '../../../hooks/error/useHandleTransactionError'
import { useNavigation } from '../../../hooks/useNavigation'
import { WithdrawalConfirmation } from '../../../popups/WithdrawalConfirmation'
import i18n from '../../../utils/i18n'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'

type Props = {
  amount: number
  address: string
  psbt: PartiallySignedTransaction
  fee: number
  feeRate: number
}

export function WithdrawalConfirmationPopup ({ amount, address, psbt, fee, feeRate }: Props) {
  const closePopup = useClosePopup()
  const setSelectedUTXOIds = useWalletState((state) => state.setSelectedUTXOIds)
  const navigation = useNavigation()
  const handleTransactionError = useHandleTransactionError()

  const confirm = async () => {
    try {
      await peachWallet.signAndBroadcastPSBT(psbt)
    } catch (e) {
      handleTransactionError(e)
    }
    setSelectedUTXOIds([])
    closePopup()
    navigation.navigate('homeScreen', { screen: 'wallet' })
  }

  return (
    <PopupComponent
      title={i18n('wallet.confirmWithdraw.title')}
      content={<WithdrawalConfirmation {...{ amount, address, fee, feeRate }} />}
      actions={
        <>
          <PopupAction label={i18n('cancel')} iconId="xCircle" onPress={closePopup} />
          <PopupAction
            label={i18n('wallet.confirmWithdraw.confirm')}
            iconId="arrowRightCircle"
            onPress={confirm}
            reverseOrder
          />
        </>
      }
    />
  )
}
